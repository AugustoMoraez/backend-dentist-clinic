import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import * as b from "bcrypt"
import { JwtService } from '@nestjs/jwt'
import { StripeService } from '../stripe/stripe.service';



@Injectable()
export class UserService {

  constructor
  (@Inject() private prisma: DatabaseService, 
  private jwtService: JwtService,
 ) { }

  async create(data: Prisma.UserCreateInput) {
    await this.validateUniqueFields(data);
    const hashPassword = await b.hash(data.password, 10);
     
    const user = await this.prisma.user.create(
      {
        data: {
          ...data,
          password: hashPassword,
          address: data.address ? { create: data.address } : undefined,
        }
      })
    const payload = { username: user.email, sub: user.id };
    return { ...user, token: this.jwtService.sign(payload) }
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
    await this.prisma.address.deleteMany();
  
    const result = await this.prisma.user.deleteMany();
    
    return result; 
  }
  async findByEmail(email:string){
    const user = await this.prisma.user.findUnique({where:{email}});
    return user ;
  }
}
