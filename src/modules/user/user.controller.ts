import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'src/zod.validatePipe';
import {createUserSchema } from './schemas/create-user.schema';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { StripeService } from '../stripe/stripe.service';
import { v4 } from 'uuid';
 


@Controller('user')
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private readonly stripeService: StripeService
  ) {}

  @Post("register")
  async create(@Body((new ZodValidationPipe(createUserSchema))) data:Prisma.UserCreateInput):Promise<UserModel> {
    const {stripe_id,stripe_connect_id} = await this.stripeService.createUserAccountConnect(data);
    const currentPeriodEnd = this.generateCurrentPeriodEnd();
    return this.UserService.create({
      ...data,
      stripe_id,
      stripe_connect_id,
      currentPeriodEnd
    });
  }
  private generateCurrentPeriodEnd(): Date {
    const now = new Date();
    now.setDate(now.getDate() + 30); 
    return now;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get("teste")
  findAll() {
    return "user"
  }


  @Delete('all')
  async deleteAllUsers() {
    const result = await this.UserService.deleteAllUsers();
    return {
      message: `${result.count} usuários deletados com sucesso.`,
    };
  }
}
