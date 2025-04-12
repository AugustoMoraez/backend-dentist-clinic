import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema } from './schema/login.schema';
import { ZodValidationPipe } from 'src/zod.validatePipe';
import { User as UserModel } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("login")
  create(@Body((new ZodValidationPipe(loginSchema))) data:{email:string,password:string}):Promise<UserModel> {
    return this.authService.login(data);
  }

 
}
