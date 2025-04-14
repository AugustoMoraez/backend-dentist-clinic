import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseService } from '../database/database.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports:[AuthModule],
  controllers: [UserController],
  providers: [UserService,DatabaseService],
})
export class UserModule {}
