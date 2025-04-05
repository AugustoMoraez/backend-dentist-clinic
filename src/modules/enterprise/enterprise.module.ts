import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Enterprise } from './entities/enterprise.entity';
import { ENTITIES } from '../sequelize/sequelize.module';

@Module({
  imports:[ENTITIES],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
})
export class EmpresaModule {}
