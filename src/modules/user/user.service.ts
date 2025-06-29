import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import * as b from "bcrypt"
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe/stripe.service';



@Injectable()
export class UserService {

  constructor
    (@Inject() private prisma: DatabaseService,
      private jwtService: JwtService,
      private config: ConfigService,
      private stripe: StripeService
    ) { }

  async create(data: Prisma.UserCreateInput) {
    await this.validateUniqueFields(data);

    const hashPassword = await b.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashPassword,
        address: data.address ? { create:data.address} : undefined,
      },
    });

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_ACCESS_TOKEN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }
  async userExists({id,email,stripe_connect_id,stripe_id}:{id?: string, email?: string, stripe_id?: string, stripe_connect_id?: string}) {
    if (!id && !email && !stripe_id && !stripe_connect_id) {
      throw new Error("Pelo menos um identificador deve ser fornecido.");
    }

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            id ? { id } : undefined,
            email ? { email } : undefined,
            stripe_id ? { stripe_id } : undefined,
            stripe_connect_id ? { stripe_connect_id } : undefined,
          ].filter(Boolean) as any, 
        },
      });

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      return user;
    } catch (error) {
      throw new Error("Erro ao buscar usuário: " + (error as Error).message);
    }
  }

  async update(id: string, data: Partial<Prisma.UserUpdateInput>) {
    if (data.password) {
      data.password = await b.hash(data.password as string, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  private async validateUniqueFields(data: Prisma.UserCreateInput) {
    const { email, cpf, cnpj } = data;

    const [emailExists, cpfExists, cnpjExists] = await Promise.all([
      this.prisma.user.findUnique({ where: { email } }),
      cpf ? this.prisma.user.findUnique({ where: { cpf } }) : null,
      cnpj ? this.prisma.user.findUnique({ where: { cnpj } }) : null,
    ]);

    if (emailExists) {
      throw new ConflictException('Já existe um usuário com esse e-mail');
    }

    if (cpfExists) {
      throw new ConflictException('Já existe um usuário com esse CPF');
    }

    if (cnpjExists) {
      throw new ConflictException('Já existe um usuário com esse CNPJ');
    }
  }
  async deleteAllUsers() {

    const users = await this.prisma.user.findMany({
      select: {
        stripe_id: true,
        stripe_connect_id: true,
      },
    });


    for (const user of users) {
      try {
        if (user.stripe_id) {
          await this.stripe.deleteCustomer(user.stripe_id);
        }

        if (user.stripe_connect_id) {
          await this.stripe.deleteConnectAccount(user.stripe_connect_id);
        }
      } catch (error) {
        console.error(
          `Erro ao deletar dados Stripe do usuário: ${user.stripe_id || user.stripe_connect_id}`,
          error.message,
        );
      }
    }

    await this.prisma.customer.deleteMany();
    await this.prisma.address.deleteMany();

    const result = await this.prisma.user.deleteMany();

    return result.count;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }
}
