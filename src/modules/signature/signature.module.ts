import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';
import { StripeModule } from '../stripe/stripe.module';
import { StripeService } from '../stripe/stripe.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../user/user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SignatureController],
  providers: [SignatureService,StripeService,UserService],
  imports: [ConfigModule, DatabaseModule,AuthModule]
})
export class SignatureModule {}
