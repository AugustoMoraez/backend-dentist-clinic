import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [StripeController],
  providers: [StripeService,ConfigService,DatabaseService],
  exports: [StripeService],
})
export class StripeModule {}
