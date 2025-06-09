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
    const user = await this.prisma.user.findUnique({
      where: { stripe_connect_id:stripeAccount  },
    });

    if (!user || !user.stripe_connect_id) {
      throw new Error("Usuário não encontrado ou sem conta Stripe Connect");
    }

    const stripeAccountID = user.stripe_connect_id;
  }

}
