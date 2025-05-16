import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService,DatabaseService],
})
export class CustomerModule {}
