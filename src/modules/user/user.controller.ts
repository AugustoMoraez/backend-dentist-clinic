import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'src/zod.validatePipe';
import {createEnterpriseSchema } from './schemas/create-user.schema';


@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post("register")
  async create(@Body((new ZodValidationPipe(createEnterpriseSchema))) data:Prisma.UserCreateInput):Promise<UserModel> {
    
    return this.UserService.create(data);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) { }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnterpriseDto) { }

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
