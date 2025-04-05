import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly EnterpriseService: EnterpriseService) {}

  @Post("register")
  create(@Body() createEnterpriseDto: CreateEnterpriseDto) {
    return this.EnterpriseService.create(createEnterpriseDto);
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
