import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { DatabaseService } from '../database/database.service';
import { createSignatureType } from './schemas/create-signature.schema';


@Injectable()
export class SignatureService {
  constructor(
    private stripe: StripeService,
    private prisma: DatabaseService
  ) { }
  async create({ description, name, stripeAccount, unit_amount }: createSignatureType) {
    const user = await this.prisma.user.findMany({
      where: { stripe_connect_id: stripeAccount },
    });

    if (!user[0] || !user[0].stripe_connect_id) {
      throw new Error("Usuário não encontrado ou sem conta Stripe Connect");
    }

    const stripeAccountID = user[0].stripe_connect_id;

    const product = await this.stripe.createCustomerProduct({
      name,
      description,
      stripeAccount,
    });

    const price = await this.stripe.createCustomerPrice({
      unit_amount,
      product: product.id,
      stripeAccount:stripeAccountID,
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
  }

}
