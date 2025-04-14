import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from '../database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>({
      secret:"123",
      signOptions:{expiresIn:"30s"}
    })
  })],
  exports:[JwtModule],
  controllers: [AuthController],
  providers: [AuthService,DatabaseService],
})
export class AuthModule {}
