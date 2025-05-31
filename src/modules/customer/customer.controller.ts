import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ZodValidationPipe } from 'src/pipes/zod/zod.validatePipe';
import { createCustomerSchema, createCustomerType } from './schemas/create-customer.schema';
import { JwtAuthGuard } from 'src/modules/auth/JWT/jwt.guard';
 

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body(
    (new ZodValidationPipe(createCustomerSchema))) 
    data:createCustomerType,
    @Request() req:any) {
    const userID = req.user.userId;
    return this.customerService.create(data,userID);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/all")
  findAll(@Request() req:any) {
    const userID = req.user.userId;
    return this.customerService.findAll(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.customerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
