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
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response as ResponseExpress,Request as requestExpress } from 'express';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/JWT/jwt.guard';
import { UserService } from '../user/user.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly user:UserService,
    private readonly stripeService: StripeService
  ) {}

  @Get("users")
  getUsers() {
    return this.stripeService.listAccountsConnect()
  }

  @UseGuards(JwtAuthGuard)
  @Get('account-link-generate')
  async generateLink(@Request() req:any)  {
    const userID = req.user.userId;
    
    const user = await this.user.userExists({id:userID});
    
    if(user){
      const url = await this.stripeService.createAccountOnboardingLink(user.stripe_connect_id as string);
      return { url };
    } 
     
  }

  @UseGuards(JwtAuthGuard)
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
    @Req() req: requestExpress,
    @Res() res: ResponseExpress,
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
