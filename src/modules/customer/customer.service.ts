import { Injectable, NotFoundException } from '@nestjs/common';
import { createCustomerType } from './schemas/create-customer.schema';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { StripeService } from '../stripe/stripe.service';
import { PaginationQueryDto } from './schemas/pagination.schema';
import { UpdateCustomerType } from './schemas/update-customer.schema';


@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly stripe: StripeService
  ) { }

  async create({ name, cpf, email, phone }: createCustomerType, userID: string) {
    const stripeCustomerId = await this.stripe.createAccountStripe(name, email, userID)

    return await this.prisma.customer.create({
      data: {
        name,
        cpf,
        email,
        phone,
        stripeCustomerId,
        userID
      }
    })
  }

  async findAll(userID: string) {
    const list = await this.prisma.customer.findMany({ where: { userID } })
    return { count: list.length, data: list }
  }

  async findAllByUser(userId: string, pagination: PaginationQueryDto) {
    const { limit, offset, search } = pagination;

    const where: any = {
      userId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, count] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        skip: offset,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { data, count };
  }

  async update(customerId: string, userId: string, data: UpdateCustomerType) {
    const existing = await this.prisma.customer.findFirst({
      where: { id: customerId, userID: userId },
    });

    if (!existing) {
      throw new NotFoundException("Cliente não encontrado");
    }

    return await this.prisma.customer.update({
      where: { id: customerId },
      data,
    });
  }


  async delete(customerId: string, userID: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer || customer.userID !== userID) {
      throw new NotFoundException('Cliente não encontrado ou acesso negado');
    }

    await this.prisma.customer.delete({
      where: { id: customerId },
    });

    return { message: 'Cliente deletado com sucesso' };
  }

}
