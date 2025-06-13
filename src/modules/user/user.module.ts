import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseService } from '../database/database.service';
import { AuthModule } from '../auth/auth.module';
import { StripeService } from '../stripe/stripe.service';
import { StripeModule } from '../stripe/stripe.module';


@Module({
  imports:[AuthModule,StripeModule],
  controllers: [UserController],
  providers: [UserService,DatabaseService,StripeService],
  
})
export class UserModule {}
