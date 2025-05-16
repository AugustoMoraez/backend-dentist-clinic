import { Injectable } from '@nestjs/common';
import { createCustomerType } from './schemas/create-customer.schema';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';


@Injectable()
export class CustomerService {
  constructor(private readonly prisma:DatabaseService) {}
  
  async create (data:Prisma.CustomerCreateInput) {
   
      const customer = await this.prisma.customer.create({data})
      return customer
   
            
 
   
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
