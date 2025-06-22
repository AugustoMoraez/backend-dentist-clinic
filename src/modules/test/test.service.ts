import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../customer/schemas/pagination.schema';
import { customers } from 'src/temp/data';
@Injectable()
export class TestService {
    async findAllByUser(userId: string, pagination: PaginationQueryDto) {
        const { limit, offset } = pagination;

        const filtered = customers.filter(c => c.userID === userId);
        
        const data = filtered.slice(offset, offset + limit);
        
        return {count:customers.length,data}
    }
}
