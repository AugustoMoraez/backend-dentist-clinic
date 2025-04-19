import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [StripeController],
  providers: [StripeService,ConfigService],
})
export class StripeModule {}
