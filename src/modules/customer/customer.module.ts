import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { DatabaseService } from '../database/database.service';
import { StripeService } from '../stripe/stripe.service';
import { StripeModule } from '../stripe/stripe.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => StripeModule),
    forwardRef(() => UserModule), // <-- aqui!
  ],

  controllers: [CustomerController],
  providers: [CustomerService,DatabaseService,StripeService],
})
export class CustomerModule {}
