import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';
import { DatabaseService } from '../database/database.service';
import { createProductType } from './schemas/createCustomerProduct.schema';
import { createPriceType } from './schemas/createCustomerPrice.schem';


@Injectable()
export class StripeService {
  private stripe: Stripe


  constructor(
    private config: ConfigService,
    private prisma: DatabaseService) {
    this.stripe = new Stripe(this.config.get("STRIPE_SECRET_KEY") as string, { apiVersion: "2025-03-31.basil" })
  }

  async createCustomerProduct({ name, description, stripeAccount }: createProductType) {
    try {
      const product = await this.stripe.products.create({
        name,
        description,
      }, {
        stripeAccount
      });

      return product;
    } catch (error) {
      console.error(`❌ Erro ao criar produto no Stripe: ${error}`);
      throw new Error('Erro ao criar produto no Stripe.');
    }
  }
  async createCustomerPrice({ unit_amount, stripeAccount, product }: createPriceType) {
    
    try {
      const price = await this.stripe.prices.create({
        unit_amount,
        currency: 'brl',
        recurring: {
          interval: 'month',
        },
        product,
      }, {
        stripeAccount
      });
      return price;
    } catch (error) {
      console.error(`❌ Erro ao criar price no Stripe: ${error}`);
      throw new Error('Erro ao criar price no Stripe.');
    }
  }
  async deleteCustomer(customerId: string): Promise<void> {
    try {
      await this.stripe.customers.del(customerId);
    } catch (error) {
      throw new Error(`Erro ao deletar cliente do Stripe: ${error.message}`);
    }
  }
  async deleteConnectAccount(accountId: string): Promise<void> {
    try {
      await this.stripe.accounts.del(accountId);
    } catch (error) {
      throw new Error(`Erro ao deletar conta Connect do Stripe: ${error.message}`);
    }
  }
  async createCheckoutSession(id: string, plan: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: this.config.get(`PRICE_ID_${plan.toLocaleUpperCase()}`),
        quantity: 1,
      }
      ],
      mode: 'subscription',
      success_url: 'http://localhost:5173/dashboard',
      cancel_url: 'http://localhost:5173/',
      customer: id
    })
    return { sessionId: session.id, sessionURL: session.url, plan }

  }
  async createAccountOnboardingLink(stripeAccountId: string): Promise<string> {
    try {
      const link = await this.stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: 'http://localhost:5173/stripe-verification/erro',
        return_url: 'http://localhost:5173/stripe-verification/sucesso',
        type: 'account_onboarding',
      });
      return link.url;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        throw new BadRequestException('ID da conta Stripe inválido.');
      }
      throw new InternalServerErrorException('Erro ao gerar link Stripe.');
    }
  }
  async createAccountStripe(name: string, email: string, company?: string) {
    const customer = await this.stripe.customers.create({
      name: name as string,
      email: email,
      metadata: {
        CompanyClient: company ? company : "Mira Assinatura"
      }
    })
    return customer.id
  }
  async createAccountConnect(data: Prisma.UserCreateInput) {

    const customerID = await this.createAccountStripe(data.name as string, data.email)
    const accountConnect = await this.stripe.accounts.create({
      type: 'express',
      email: data.email,

      metadata: {
        customerID: customerID
      }
    })
    return { stripe_id: customerID, stripe_connect_id: accountConnect.id };
  }
  async listAccountsConnect() {
    const list = await this.stripe.accounts.list({ limit: 10 })
    return list;
  }
  async handleWebhookEvent(payload: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.get("WEB_HOOK") as string
      );
      console.log(`✅ Evento recebido: ${event.type}`);
    } catch (err) {
      console.error('❌ Erro na verificação da assinatura do webhook:', err.message);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;


        if (!customerId || !subscriptionId) {
          console.warn("⚠️ Dados ausentes no evento checkout.session.completed");
          break;
        }


        try {
          const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
          const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;

          const email = customer.email;
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);
          if (!email) {
            console.warn("⚠️ Email do cliente não encontrado.");
            break;
          }
          let plan;
          switch (priceId) {
            case this.config.get('PRICE_ID_BASIC'): plan = 'BASIC'; break;
            case this.config.get('PRICE_ID_PRO'): plan = 'PRO'; break;
            case this.config.get('PRICE_ID_PREMIUM'): plan = 'PREMIUM'; break;
          }

          await this.prisma.user.update({
            where: { email },
            data: {
              plan,
              subscription_id: subscriptionId,
              subscription_Status: 'ACTIVE',
              currentPeriodEnd: expirationDate
            }
          });

          console.log(`✅ Assinatura ativada para o usuário com email: ${email}`);
        } catch (err) {
          console.error("❌ Erro ao atualizar o usuário com subscription_id:", err);
        }

        break;
      }

      case 'invoice.paid': {
        // Exemplo: pode ser usado para marcar pagamentos como confirmados
        console.log('✅ Fatura paga');
        break;
      }

      case 'invoice.payment_failed': {
        console.warn('⚠️ Pagamento da fatura falhou');
        break;
      }

      case 'customer.subscription.updated': {
        console.log('🔄 Assinatura atualizada');
        break;
      }

      case 'customer.subscription.deleted': {
        console.log('🗑️ Assinatura cancelada');
        break;
      }

      case 'customer.subscription.created': {
        console.log('🆕 Assinatura criada');
        break;
      }

      default: {
        console.log(`ℹ️ Evento não tratado: ${event.type}`);
        break;
      }
    }
  }
}
