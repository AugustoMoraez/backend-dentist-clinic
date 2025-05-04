import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';


@Injectable()
export class StripeService {
  private stripe: Stripe

  constructor(private config: ConfigService) {
    this.stripe = new Stripe(this.config.get("STRIPE_SECRET_KEY") as string, { apiVersion: "2025-03-31.basil" })
  }

  async createCheckoutSession(id: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: this.config.get('PRICE_ID'),
        quantity: 1,
      }
      ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      customer: id
    })
    return { sessionId: session.id, sessionURL: session.url }
  }


  async createAccountStripe({name,email}:Prisma.UserCreateInput){
    const customer = await this.stripe.customers.create({
      name: name as string,
      email:email,
      metadata: {
        CompanyClient: "Mira Cobranca"
      }
    })
    return customer.id
  }

  async createAccountConnect(data: Prisma.UserCreateInput) {
    
    const customerID = await this.createAccountStripe(data)
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
  async handleWebhookEvent(payload: Buffer, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.WEB_HOOK as string
    );

    switch (event.type) {
      case 'checkout.session.completed':
        // tratar sucesso do checkout
         
        break;

      case 'invoice.paid':
        // tratar pagamento bem-sucedido de fatura
        
        break;

      case 'invoice.payment_failed':
        // tratar falha no pagamento da fatura
        break;

      case 'customer.subscription.updated':
        // tratar atualização na assinatura (upgrade/downgrade/cancelamento agendado)
        break;

      case 'customer.subscription.deleted':
        // tratar cancelamento de assinatura
        break;

      case 'customer.subscription.created':
        // assinatura nova criada
        break;

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }
  }
}
