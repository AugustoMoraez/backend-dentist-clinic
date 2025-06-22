import { BadRequestException, Controller, Get, Query, UseGuards,Request } from '@nestjs/common';
import { TestService } from './test.service';
import { JwtAuthGuard } from '../auth/JWT/jwt.guard';
import { PaginationQuerySchema } from '../customer/schemas/pagination.schema';

@Controller('test')
@UseGuards(JwtAuthGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Get("customer/all")
    async findAllByUser(
      @Request() req: any,
      @Query() query: any,
    ) {
  
      const userId = req.user.userId;
  
      const result = PaginationQuerySchema.safeParse(query);
      if (!result.success) {
        throw new BadRequestException(result.error.format());
      }
      
      return this.testService.findAllByUser(userId, result.data);
    }
}
