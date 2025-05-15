import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './modules/stripe/stripe.module';
import { MailerCustomModule } from './modules/mailer/mailer.module';
import { CustomerModule } from './modules/customer/customer.module';
 
 
 


@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    StripeModule,
    ConfigModule.forRoot({isGlobal:true}),
    MailerCustomModule,
    CustomerModule,
     
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
