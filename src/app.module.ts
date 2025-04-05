import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './modules/enterprise/enterprise.module';
import { ORM_MODULE } from './modules/sequelize/sequelize.module';

@Module({
  imports: [
    EmpresaModule,
    ORM_MODULE
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
