import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema } from './schema/login.schema';
import { ZodValidationPipe } from 'src/zod.validatePipe';
import { User as UserModel } from '@prisma/client';
import { DatabaseService } from '../database/database.service';


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

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user)throw new NotFoundException("Usuario nao encontrado");
    
    return await this.authService.handleForgotPassword(email);
    
  }



}
