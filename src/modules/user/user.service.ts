import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import * as b from "bcrypt"
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';



@Injectable()
export class UserService {

  constructor
    (@Inject() private prisma: DatabaseService,
      private jwtService: JwtService,
      private config: ConfigService,
    ) { }

  async create(data: Prisma.UserCreateInput) {
    await this.validateUniqueFields(data);

    const hashPassword = await b.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashPassword,
        address: data.address ? { create: data.address } : undefined,
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
    // Deleta todos os clientes vinculados aos usuário
    await this.prisma.customer.deleteMany({});

    // Deleta todos os endereços vinculados aos usuários
    await this.prisma.address.deleteMany({});

    // Deleta os próprios usuários
    const result = await this.prisma.user.deleteMany({});

    return result.count;
  }
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }
}
