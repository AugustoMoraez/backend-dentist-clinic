import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';


@Injectable()
export class StripeService {
  private stripe: Stripe
  
  constructor(private config: ConfigService) {
    this.stripe = new Stripe(this.config.get("STRIPE_SECRET_KEY") as string, {apiVersion:"2025-03-31.basil"})
  }

  async createCheckoutSession (id:string){
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
      customer:id
    })
    return { sessionId: session.id,sessionURL:session.url }
  }
  
  async createUserAccountConnect (data:Prisma.UserCreateInput){
    const customer = await this.stripe.customers.create({
      name:data.name as string,
      email:data.email,
      metadata:{
        CompanyClient:"Mira Cobranca"
      }

    })
    const accountConnect = await this.stripe.accounts.create({
      type: 'express',
      email: data.email, 

      metadata: {
        customerID:customer.id
      },
    }) 
    return {stripe_id:customer.id,stripe_connect_id:accountConnect.id};
  }

  async listAccountsConnect() {
    const list = await this.stripe.accounts.list({limit:10})
    return list;
  }
}
