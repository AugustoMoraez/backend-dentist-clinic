import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { DatabaseService } from '../database/database.service';
import { createSignatureType } from './schemas/create-signature.schema';
import { UserService } from '../user/user.service';


@Injectable()
export class SignatureService {
  constructor(
    private stripe: StripeService,
    private prisma: DatabaseService,
    private user: UserService

  ) { }
  async create({ description, name, stripeAccount, unit_amount }: createSignatureType) {
    const user = await this.user.userExists({stripe_connect_id:stripeAccount})
    
    const canCreate = await this.canUserCreatePlan(user.stripe_connect_id as string)
    if(canCreate){
      const stripeAccountID = user.stripe_connect_id;
  
      const product = await this.stripe.createCustomerProduct({
        name,
        description,
        stripeAccount,
      });
  
      const price = await this.stripe.createCustomerPrice({
        unit_amount,
        product: product.id,
        stripeAccount: stripeAccountID as string,
      });
  
      const signature = await this.prisma.signature.create({
        data: {
          name,
          unit_amount,
          stripeProductId: product.id,
          stripePriceId: price.id,
          userID: user.id,
        },
      });
  
      return signature;
    }else{
      throw new UnauthorizedException("Limite de assinaturas atingido para seu plano.");
    }
  }
  async canUserCreatePlan(stripe_connect_id:string) {
    const user = await this.prisma.user.findUnique({
      where: { stripe_connect_id },
      include: { Signature: true },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado.");
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
  async getAllSignatures(id:string){
    const user = this.prisma.signature.findMany({
      where:{
        userID:id
      }
    })
    return user;
  }


}
