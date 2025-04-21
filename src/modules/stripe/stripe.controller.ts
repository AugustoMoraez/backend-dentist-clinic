import { 
  Controller,
  Get, 
  Param,   
  Post,
  Headers,
  Body,
  Req,
  Res,
  HttpStatus, } from '@nestjs/common';
import { Response, Request } from 'express';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Get("users")
  getUsers(){
    return this.stripeService.listAccountsConnect()
  }
  @Get("checkout/:id")
  getCheckoutUrl(@Param("id")id:string){
    return this.stripeService.createCheckoutSession(id)
  }
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = (req as any).rawBody;

    try {
      await this.stripeService.handleWebhookEvent(rawBody, signature);
      return res.status(HttpStatus.OK).send();
    } catch (err) {
      console.error('Erro no webhook:', err.message);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
  }

}
