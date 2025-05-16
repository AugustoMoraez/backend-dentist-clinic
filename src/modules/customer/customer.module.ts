import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { DatabaseService } from '../database/database.service';
import { StripeService } from '../stripe/stripe.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService,DatabaseService,StripeService],
})
export class CustomerModule {}
