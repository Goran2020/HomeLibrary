import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/misc/api.response';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>
    ) {}
        
    async getAllUsers(): Promise<User[] | ApiResponse> {
        const users = await this.user.find();
        if (users.length === 0) {
            return new ApiResponse('ok', -8001, 'There is no users in database');
        }
        if (!users) {
            return new ApiResponse('error', -8002, 'Cannot find any user');
        }

        return users;
    }
    


}
