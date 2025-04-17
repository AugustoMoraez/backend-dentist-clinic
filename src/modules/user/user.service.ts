import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
 import * as b from "bcrypt"
import { JwtService } from '@nestjs/jwt';
 


@Injectable()
export class UserService {
  
  constructor(@Inject() private  prisma: DatabaseService, private jwtService:JwtService){}
  
  async create(data:Prisma.UserCreateInput) {
    
    const hashPassword = await b.hash(data.password,10) 
    const user = await this.prisma.user.create(
      { data:{
        ...data,
        password:hashPassword,
        address: data.address ? { create: data.address } : undefined,
      }
  })
      const payload = {username:user.email,sub:user.id};
      return {...user,token:this.jwtService.sign(payload)}
  }

  
}
