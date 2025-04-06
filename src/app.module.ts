import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnterpriseModule } from './modules/enterprise/enterprise.module';
import { DatabaseModule } from './modules/database/database.module';
 


@Module({
  imports: [
    EnterpriseModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
