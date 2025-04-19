import { Controller, Get } from '@nestjs/common';
import { StripeService } from './stripe.service';


@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Get("users")
  getUsers(){
    return this.stripeService.listAccountsConnect()
  }
}
