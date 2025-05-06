import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from '../database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './JWT/jwt.strategy';
import { UserService } from '../user/user.service';
import { MailService } from '../mailer/mailer.service';

@Module({
  imports: [JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: "123",
      signOptions: { expiresIn: "4h" }
    })
  })],
  exports: [JwtModule,JwtStrategy],
  controllers: [AuthController],
  providers: [
    MailService,
    UserService,
    AuthService,
    DatabaseService,
    JwtStrategy
  ],
})
export class AuthModule { }
