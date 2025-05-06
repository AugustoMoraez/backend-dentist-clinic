import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema } from './schema/login.schema';
import { ZodValidationPipe } from 'src/zod.validatePipe';
import { User as UserModel } from '@prisma/client';
import { UserService } from '../user/user.service';
import { MailService } from '../mailer/mailer.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService:UserService,
    private readonly mailService:MailService
  ) { }

  @Post("login")
  create(@Body((new ZodValidationPipe(loginSchema))) data: { email: string, password: string }): Promise<UserModel> {
    return this.authService.login(data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
     this.mailService.sendResetPassword(email,"123")
    return { message: 'Código enviado' };
  }



}
