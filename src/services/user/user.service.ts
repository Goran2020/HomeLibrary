import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/misc/api.response';
import { AddUserDto } from 'src/dtos/user/add.user.dto';
import * as crypto from 'crypto';
import { EditUserDto } from 'src/dtos/user/edit.user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>
    ) {}
    
    
    //  Vrati sve korisnike iz BP //
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

    async getByUsername(username: string): Promise<User | null> {
        const user = await this.user.findOne({
            username: username,
        })

        if (!user) {
            return null;
        }

        return user;
        
    }

    // Dodaj novog korisnika - registracija //
    async addUser(data: AddUserDto): Promise<User | ApiResponse> {
        
        const pwHash = crypto.createHash('sha512');
        pwHash.update(data.password);
        const pwHashString = pwHash.digest('hex').toUpperCase();
        
        const newUser = new User();
        
        newUser.username = data.username;
        newUser.passwordHash = pwHashString;

        try {
            const createUser = await this.user.save(newUser);

            if (!createUser) {
                throw new Error('Something went wrong...')
            }

            return createUser;

        } catch(e) {
            return new ApiResponse('error', -8003, 'Account cannot be created');
        }
    }


    //  promeni šifru korisniku //
    async editUser(id: number, data: EditUserDto): Promise<User | ApiResponse> {
        const user = await this.user.findOne(id);

        if(!user) {
            return new ApiResponse('error', -8004, 'This user doesnt exists');
        }

        const pwHash = crypto.createHash('sha512');
        pwHash.update(data.password);
        const pwHashString = pwHash.digest('hex').toUpperCase();  
        user.passwordHash = pwHashString;
        
        return await this.user.save(user);
    }
    


}
