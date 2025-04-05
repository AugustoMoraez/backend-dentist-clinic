import { Module } from '@nestjs/common';
import { EmpresaService } from './enterprise.service';
import { EmpresaController } from './enterprise.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Enterprise } from './entities/enterprise.entity';
import { ENTITIES } from '../sequelize/sequelize.module';

@Module({
  imports:[ENTITIES],
  controllers: [EmpresaController],
  providers: [EmpresaService],
})
export class EmpresaModule {}
