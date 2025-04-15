import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'src/zod.validatePipe';
import {createUserSchema } from './schemas/create-user.schema';
import { JwtAuthGuard } from '../auth/jwt.guard';
 


@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post("register")
  async create(@Body((new ZodValidationPipe(createUserSchema))) data:Prisma.UserCreateInput):Promise<UserModel> {
    
    return this.UserService.create(data);
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
