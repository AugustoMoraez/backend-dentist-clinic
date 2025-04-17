import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';
import { StripeModule } from './stripe.module';

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
    }
    async registerCustomer (data:Prisma.UserCreateInput){
         
        const customer = await this.stripe.customers.create({
            name:data.name as string,
            email:data.email
            
        })
        return customer;
    }



}
