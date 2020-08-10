import { Controller, Post, Body, Req } from "@nestjs/common";
import { UserService } from "src/services/user/user.service";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { LoginUserDto } from "src/dtos/user/login.user.dto";
import * as crypto from 'crypto';
import { LoginInfoUserDto } from "src/dtos/user/login.info.user.dto";
import * as jwt from 'jsonwebtoken';
import { JwtDataUserDto } from "src/dtos/user/jwt.data.user.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";

@Controller('auth')
export class AuthController {
    constructor(
        public userService: UserService
    ) {}

    //  Registracija novih korisnika //
    @Post('user/register')
    userRegister(@Body() data: AddUserDto): Promise<User | ApiResponse> {
        return this.userService.addUser(data);
    }


    //  Metod za logovanje korisnika //
    @Post('login')
    async doLogin(@Body() data: LoginUserDto, @Req() req: Request): Promise<LoginInfoUserDto | ApiResponse> {
        const user = await this.userService.getByUsername(data.username);

        if (!user) {
            return new ApiResponse('error', -8006);
        }

        const pwHash = crypto.createHash('sha512');
        pwHash.update(data.password);
        const pwHashString = pwHash.digest('hex').toUpperCase();

        if (user.passwordHash !== pwHashString) {
            return new ApiResponse('error', -8005);
        }

        // userId, username, i token su nam potrebni 
        // prvimo token, serijalizacija podataka
        const jwtData = new JwtDataUserDto();
        jwtData.userId = user.userId;
        jwtData.username = user.username;

        let sada = new Date();
        sada.setDate(sada.getDate() + 14);  // trenutni datum + 14 dana

        const istekTimestamp = sada.getTime() / 1000;
        jwtData.exp = istekTimestamp;
        jwtData.ip = req.ip;
        jwtData.ua = req.headers['user-agent'];

        // potpisivanje tokena //

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoUserDto(
            user.userId,
            user.username,
            token
        );



        return new Promise(resolve => resolve(responseObject));
    }
}