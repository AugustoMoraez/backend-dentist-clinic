import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query, BadRequestException, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ZodValidationPipe } from 'src/pipes/zod/zod.validatePipe';
import { createCustomerSchema, createCustomerType } from './schemas/create-customer.schema';
import { JwtAuthGuard } from 'src/modules/auth/JWT/jwt.guard';
import { PaginationQuerySchema } from './schemas/pagination.schema';
import { updateCustomerSchema, UpdateCustomerType } from './schemas/update-customer.schema';


@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }


  @Post()
  create(@Body(
    (new ZodValidationPipe(createCustomerSchema)))
  data: createCustomerType,
    @Request() req: any) {
    const userID = req.user.userId;
    return this.customerService.create(data, userID);
  }

  @Get("/all")
  findAll(@Request() req: any) {
    const userID = req.user.userId;
    return this.customerService.findAll(userID);
  }

  @Get()
  async findAllByUser(
    @Request() req: any,
    @Query() query: any
  ) {
    const userId = req.user.userId;

    const result = PaginationQuerySchema.safeParse(query);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    return this.customerService.findAllByUser(userId, result.data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body(new ZodValidationPipe(updateCustomerSchema)) data: UpdateCustomerType
  ) {
    const userID = req.user.userId;
    return this.customerService.update(id, userID, data);
  }

  @Delete(':id')
  async deleteCustomer(
    @Param('id') id: string,
    @Request() req: any
  ) {
    const userID = req.user.userId;
    return this.customerService.delete(id, userID);
  }



}
