import { Module } from '@nestjs/common';
import { EmpresaService } from './enterprise.service';
import { EmpresaController } from './enterprise.controller';

@Module({
  controllers: [EmpresaController],
  providers: [EmpresaService],
})
export class EmpresaModule {}
