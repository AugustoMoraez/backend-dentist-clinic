import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';


@Module({
  imports:[],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
})
export class EmpresaModule {}
