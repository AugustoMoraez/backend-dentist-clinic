import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema } from './schema/login.schema';
import { ZodValidationPipe } from 'src/pipes/zod.validatePipe';
import { Prisma, User as UserModel } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { resetPasswordSchema, resetPasswordType } from './schema/reset-passwor.schema';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: DatabaseService

  ) { }

  @Post("login")
  create(@Body((new ZodValidationPipe(loginSchema))) data: { email: string, password: string }): Promise<UserModel> {
    return this.authService.login(data);
  }

  @Post('request-verification')
  async varifyAccount(@Body() body: { email: string }) {
    const {email}=body;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user||user.AccountVerification === true) throw new NotFoundException("Usuario não encontrado ou já ativo.");

    return await this.authService.handleRequestVerification(email);

  }
  @Post('verify-account')
  async verifyAccount(@Body('token') token:string) {
    return this.authService.handleVerificationAccount(token);
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException("Usuario nao encontrado");

    return await this.authService.handleForgotPassword(email);

  }
  
  @Post('reset-password')
  async resetPassword(@Body((new ZodValidationPipe(resetPasswordSchema))) data: resetPasswordType) {
    return this.authService.handleResetPassword(data.token,data.newPassword);
  }



}
