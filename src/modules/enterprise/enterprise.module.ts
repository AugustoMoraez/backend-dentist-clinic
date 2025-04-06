import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { DatabaseService } from '../database/database.service';


@Module({
  controllers: [EnterpriseController],
  providers: [EnterpriseService,DatabaseService],
})
export class EnterpriseModule {}
