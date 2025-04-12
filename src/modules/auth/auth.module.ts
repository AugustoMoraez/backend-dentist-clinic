import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService,DatabaseService],
})
export class AuthModule {}
