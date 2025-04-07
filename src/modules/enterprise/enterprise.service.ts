import { Inject, Injectable } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
 


@Injectable()
export class EnterpriseService {
  
  constructor(@Inject() private  prisma: DatabaseService){}
  
  async create(createEnterpriseDto:Prisma.EnterpriseCreateInput) {
    return await this.prisma.enterprise.create({
      data: {
        email: createEnterpriseDto.email,
        password: createEnterpriseDto.password,
        company_name: createEnterpriseDto.company_name,
        fantasy_name: createEnterpriseDto.fantasy_name,
        cnpj: createEnterpriseDto.cnpj,
        cpf: createEnterpriseDto.cpf,
        contact_1: createEnterpriseDto.contact_1,
        contact_2: createEnterpriseDto.contact_2
      },
    
    })
  }

  findAll() {
    return `This action returns all empresa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} empresa`;
  }

  update(id: number, UpdateEnterpriseDto: UpdateEnterpriseDto) {
    return `This action updates a #${id} empresa`;
  }

  remove(id: number) {
    return `This action removes a #${id} empresa`;
  }
}
