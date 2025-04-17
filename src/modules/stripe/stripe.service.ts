import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion:"2025-03-31.basil"})
    }


    async createCheckoutSession (){
        const session = await this.stripe.checkout.sessions.create({
            
        })
    }
    async registerCustomer (data:Prisma.UserCreateInput){
         
        const customer = await this.stripe.customers.create({
            data
        })
        return customer;
    }



}
