import {
  Controller,
  Get,
  Param,
  Post,
  Headers,
  Body,
  Req,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }
  @Get("users")
  getUsers() {
    return this.stripeService.listAccountsConnect()
  }


  @Post("checkout/:id/:plan")
  getCheckoutUrl(
    @Param("id") id: string,
    @Param("plan") plan: 'basic' | 'pro' | 'premium'
  ) {

    const validPlans = ['basic', 'pro', 'premium'];

    if (!validPlans.includes(plan)) {
      throw new BadRequestException(`Plano inválido: ${plan.toUpperCase()}`);
    }
    return this.stripeService.createCheckoutSession(id, plan.toLocaleUpperCase());
  }


  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.body;

    try {
      await this.stripeService.handleWebhookEvent(rawBody, signature);
      return res.status(HttpStatus.OK).send();
    } catch (err) {
      console.error('Erro no webhook:', err.message);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
  }

}
