import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ZodValidationPipe } from 'src/pipes/zod/zod.validatePipe';
import { createCustomerSchema, createCustomerType } from './schemas/create-customer.schema';
import { JwtAuthGuard } from 'src/modules/auth/JWT/jwt.guard';
import { PaginationQuerySchema } from './schemas/pagination.schema';


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
    @Param('userId', ParseIntPipe) userId: string,
    @Query() query: any,
  ) {
    const result = PaginationQuerySchema.safeParse(query);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    return this.customerService.findAllByUser(userId, result.data);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
