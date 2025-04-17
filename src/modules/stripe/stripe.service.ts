import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';


@Injectable()
export class StripeService {
    private stripe: Stripe
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion:"2025-03-31.basil"})
    }


    async createCheckoutSession (id:string){
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                  price_data: {
                    currency: 'brl',
                    unit_amount: 9999,
                    product_data: {
                      name: 'Assinatura Mira Cobrança',
                    },
                  },
                  quantity: 1,
                },
              ],
            mode: 'subscription',
            success_url: 'http://localhost:3000/success', 
            cancel_url: 'http://localhost:3000/cancel',  
            customer:id
        })
        return { sessionId: session.id }
    }
    async createUserAccountStripe (data:Prisma.UserCreateInput){
      const account = await this.stripe.accounts.create({
        type: 'express',
        email: data.email, 
        metadata: {
          userId: data.id as string, 
        },
      }) 
      const customer = await this.stripe.customers.create({
        name:data.name as string,
        email:data.email,
        metadata:{
          id_user:data.id as string,
          id_account_express:account.id
        }

      })
      return {stripe_id:customer.id,account};
    }



}
