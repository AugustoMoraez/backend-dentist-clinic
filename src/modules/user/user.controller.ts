import { Controller, Get, Post, Body, Delete, UseGuards, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'src/pipes/zod/zod.validatePipe';
import { createUserSchema } from './schemas/create-user.schema';
import { JwtAuthGuard } from '../auth/JWT/jwt.guard';
import { StripeService } from '../stripe/stripe.service';
import { Response } from 'express';


@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private readonly stripeService: StripeService
  ) { }

 

@Post('register')
async create(
  @Body(new ZodValidationPipe(createUserSchema)) data: Prisma.UserCreateInput,
  @Res({ passthrough: true }) res: Response,
) {
  
  const { stripe_id, stripe_connect_id } = await this.stripeService.createAccountConnect(data);

  
  const { user, accessToken, refreshToken } = await this.UserService.create({
    ...data,
    stripe_id,
    stripe_connect_id,
  });

  
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15, 
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return user
}




@Get("teste")
findAll() {
  return "user"
}


@Delete('all')
async deleteAllUsers() {
  const result = await this.UserService.deleteAllUsers();
  return {
    message: `${result} usuários deletados com sucesso.`,
  };
}
}
