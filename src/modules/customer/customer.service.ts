import { Injectable } from '@nestjs/common';
import { createCustomerType } from './schemas/create-customer.schema';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { StripeService } from '../stripe/stripe.service';


@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly stripe: StripeService
  ) { }

  async create({name,cpf,email,phone}: createCustomerType,userID:string) {
    const stripeCustomerId= await this.stripe.createAccountStripe(name,email,userID )
    return await this.prisma.customer.create({ data:{
      name,
      cpf,
      email,
      phone,
      stripeCustomerId,
      userID
    } })
  }

  async findAll(userID:string) {
    const list =  await this.prisma.customer.findMany({where:{userID}})
    return {count:list.length,data:list}
  }

  findOne(name: string) {
    
    
    
    return null;
  }

  update(id: number, updateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
