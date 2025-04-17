import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'src/zod.validatePipe';
import {createUserSchema } from './schemas/create-user.schema';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { StripeService } from '../stripe/stripe.service';
 


@Controller('user')
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private readonly stripeService: StripeService
  ) {}

  @Post("register")
  async create(@Body((new ZodValidationPipe(createUserSchema))) data:Prisma.UserCreateInput):Promise<UserModel> {
    const {id:stripe_id} = await this.stripeService.registerCustomer(data);
    return this.UserService.create({...data,stripe_id});
  }
  
  @UseGuards(JwtAuthGuard)
  @Get("teste")
  findAll() {
    return "user"
  }

  @Get(':id')
  findOne(@Param('id') id: string) { }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnterpriseDto) { }

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
