import { Inject, Injectable } from '@nestjs/common';
// import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
 


@Injectable()
export class EnterpriseService {
  
  constructor(@Inject() private  prisma: DatabaseService){}
  
  async create(data:Prisma.EnterpriseCreateInput) {
    
    return await this.prisma.enterprise.create({ data })
  }

  findAll() {}

  findOne(id: number) {}

  update(id: number, UpdateEnterpriseDto) { }

  remove(id: number) {}
}
