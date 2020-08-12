import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/misc/api.response';
import { AddUserDto } from 'src/dtos/user/add.user.dto';
import * as crypto from 'crypto';
import { EditUserDto } from 'src/dtos/user/edit.user.dto';
import { UserToken } from 'src/entities/user-token.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>,
        @InjectRepository(UserToken)
        private readonly userToken: Repository<UserToken>
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

    async getById(id: number): Promise<User | null> {
        const user: User = await this.user.findOne(id);

        if(!user) {
            return null;
        }

        return user;

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
    

    // metod koji upisuje RT usera u BP
    async addToken(userId: number, token: string, expiresAt: string): Promise<UserToken | ApiResponse> {
        const userToken = new UserToken();

        userToken.userId = userId;
        userToken.token = token;
        userToken.expiresAt = expiresAt;
        
        if (!userToken) {
            return new ApiResponse('error', -8008, 'Token canno be added.');
        }
        return await this.userToken.save(userToken);
    }

    // metod koji će dopremiti token //

    async getUserToken(token: string): Promise<UserToken> {
        return await this.userToken.findOne({
            token: token
        });
    }

    // disable-ovanje tokena

    async invalidateToken(token: string): Promise<UserToken | ApiResponse> {
        const userToken = await this.userToken.findOne({
            token: token,
        })

        if (!userToken) {
            return new ApiResponse('error', -8008, 'Token cannot be added.');
        }

        userToken.isValid = 0;

        await this.userToken.save(userToken);

        return await this.getUserToken(token);
    }

    async invlidateUserTokens(userId: number): Promise<(UserToken| ApiResponse)[]> {
        const userTokens = await this.userToken.find({
            userId : userId
        });

        const results = [];

        for (const userToken of userTokens) {
            results.push(this.invalidateToken(userToken.token));
        }

        return results;
    }

}
