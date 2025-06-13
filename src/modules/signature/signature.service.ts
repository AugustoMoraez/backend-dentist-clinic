import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { DatabaseService } from '../database/database.service';
import { createSignatureType } from './schemas/create-signature.schema';


@Injectable()
export class SignatureService {
  constructor(
    private stripe: StripeService,
    private prisma: DatabaseService,

  ) { }
  async create({ description, name, stripeAccount, unit_amount }: createSignatureType) {
    const user = await this.prisma.user.findMany({
      where: { stripe_connect_id: stripeAccount },
    });

    if (!user[0] || !user[0].stripe_connect_id) {
      throw new Error("Usuário não encontrado ou sem conta Stripe Connect");
    }
    const canCreate = await this.canUserCreatePlan(user[0].stripe_connect_id)
    if(canCreate){


      const stripeAccountID = user[0].stripe_connect_id;
  
      const product = await this.stripe.createCustomerProduct({
        name,
        description,
        stripeAccount,
      });
  
      const price = await this.stripe.createCustomerPrice({
        unit_amount,
        product: product.id,
        stripeAccount: stripeAccountID,
      });
  
      const signature = await this.prisma.signature.create({
        data: {
          name,
          unit_amount,
          stripeProductId: product.id,
          stripePriceId: price.id,
          userID: user[0].id,
        },
      });
  
      return signature;
    }else{
      throw new Error("Limite de assinaturas atingido para seu plano.");
    }
  }
  async canUserCreatePlan(stripe_connect_id:string) {
    const user = await this.prisma.user.findUnique({
      where: { stripe_connect_id },
      include: { Signature: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const currentSignatureCount = user.Signature.length;

    switch (user.plan) {
      case "BASIC":
        return currentSignatureCount < 1;
      case "PRO":
        return currentSignatureCount < 3;
      case 'PREMIUM':
        return true;
      default:
        return false;
    }

  }

}
