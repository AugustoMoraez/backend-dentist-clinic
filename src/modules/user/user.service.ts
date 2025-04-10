import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
 import * as b from "bcrypt"
 


@Injectable()
export class UserService {
  
  constructor(@Inject() private  prisma: DatabaseService){}
  
  async create(data:Prisma.UserCreateInput) {
    
    const hashPassword = await b.hash(data.password,10) 
    return await this.prisma.user.create(
      { data:{
        ...data,
        password:hashPassword,
        address: data.address ? { create: data.address } : undefined
      }})
  }

  findAll() {}

  findOne(id: number) {}

  update(id: number, UpdateEnterpriseDto) { }

  remove(id: number) {}
}
