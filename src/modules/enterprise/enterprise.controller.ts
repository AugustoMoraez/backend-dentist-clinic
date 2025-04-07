import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { Enterprise as EnterpriseModel, Prisma } from '@prisma/client';


@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly EnterpriseService: EnterpriseService) {}

  @Post("register")
  async create(@Body() createEnterpriseDto:Prisma.EnterpriseCreateInput):Promise<EnterpriseModel> {
    
    return this.EnterpriseService.create({
      email:createEnterpriseDto.email,
      password:createEnterpriseDto.password,
      company_name:createEnterpriseDto.company_name,
      fantasy_name:createEnterpriseDto.fantasy_name,
      cnpj:createEnterpriseDto.cnpj,
      cpf:createEnterpriseDto.cpf,
      contact_1:createEnterpriseDto.contact_1,
      contact_2:createEnterpriseDto.contact_2
    });
  }

  @Get()
  findAll() {
    return this.EnterpriseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.EnterpriseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnterpriseDto: UpdateEnterpriseDto) {
    return this.EnterpriseService.update(+id, updateEnterpriseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.EnterpriseService.remove(+id);
  }
}
