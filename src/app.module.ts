import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './modules/enterprise/enterprise.module';


@Module({
  imports: [
    EmpresaModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
