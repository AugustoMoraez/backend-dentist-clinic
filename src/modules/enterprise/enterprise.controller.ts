import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { Enterprise as EnterpriseModel, Prisma } from '@prisma/client';


@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly EnterpriseService: EnterpriseService) {}

  @Post("register")
  async create(@Body() data:Prisma.EnterpriseCreateInput):Promise<EnterpriseModel> {
    
    return this.EnterpriseService.create(data);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) { }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnterpriseDto: UpdateEnterpriseDto) { }

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
