// user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseService } from '../database/database.service';
import { AuthModule } from '../auth/auth.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [AuthModule, forwardRef(() => StripeModule)],
  controllers: [UserController],
  providers: [UserService, DatabaseService],
  exports: [UserService], // Exporte o UserService para que o StripeService possa usá-lo
})
export class UserModule {}
