import {  MailerModule as NestMailerModule  } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mailer.service';


@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'moraezaugusto@gmail.com',
          pass: 'yyim bpwp patx rsya',
        },
      },
      defaults: {
        from: '"MIRA COBRANÇA" <moraezaugusto@gmail.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailerCustomModule {}
