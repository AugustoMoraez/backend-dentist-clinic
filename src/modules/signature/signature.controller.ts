import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { JwtAuthGuard } from '../auth/JWT/jwt.guard';
import { ZodValidationPipe } from 'src/pipes/zod/zod.validatePipe';
import { createSignatureSchema, createSignatureType } from './schemas/create-signature.schema';
import { UserService } from '../user/user.service';


@Controller('signature')
@UseGuards(JwtAuthGuard)
export class SignatureController {
  constructor(
    private user:UserService,
    private signatureService: SignatureService,
  ) {}

  @Post()
  async create(@Body(new ZodValidationPipe(createSignatureSchema)) {name,description,stripeAccount,unit_amount}: createSignatureType){
    this.user.userExists({stripe_connect_id:stripeAccount})
    this.signatureService.create({
      name,
      description,
      stripeAccount,
      unit_amount
    });
  }

}
