import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';
import { StripeModule } from '../stripe/stripe.module';
import { StripeService } from '../stripe/stripe.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [SignatureController],
  providers: [SignatureService,StripeService],
  imports: [ConfigModule, DatabaseModule]
})
export class SignatureModule {}
