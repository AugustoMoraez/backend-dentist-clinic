import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './modules/enterprise/enterprise.module';
import { DatabaseModule } from './modules/database/database.module';


@Module({
  imports: [
    EmpresaModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
