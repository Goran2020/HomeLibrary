import { Controller, Post, Body, Req, HttpException, HttpStatus } from "@nestjs/common";
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
import { JwtRefreshDataDto } from "src/dtos/user/jwt.refresh.dto";
import { UserRefreshTokenDto } from "src/dtos/user/user.refresh.token.dto";

@Controller('auth')
export class AuthController {
    constructor(
        public userService: UserService,        
    ) {}

    //  Registracija novih korisnika //
    @Post('register')
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
        jwtData.role = "user";       
        jwtData.exp =  this.getDatePlus(60 * 5);
        jwtData.ip = req.ip;
        jwtData.ua = req.headers['user-agent'];

        // potpisivanje tokena //
        //console.log("jwtData:",jwtData);
        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        // refreshtoken //

        const jwtRefreshData = new JwtRefreshDataDto();
        jwtRefreshData.role = jwtData.role;
        jwtRefreshData.userId = jwtData.userId;
        jwtRefreshData.username = jwtData.username;
        jwtRefreshData.exp = this.getDatePlus(60 * 60 *24 * 31);
        jwtRefreshData.ip = jwtData.ip;
        jwtRefreshData.ua = jwtData.ua;

        let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(), jwtSecret);


        const responseObject = new LoginInfoUserDto(
            user.userId,
            user.username,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp)
        );

        await this.userService.addToken(
            user.userId, 
            refreshToken, 
            this.getDatebasedateFormat(this.getIsoDate(jwtRefreshData.exp))
        );



        return new Promise(resolve => resolve(responseObject));
    }

    @Post('user/refresh')
    async userTokenRefresh(@Req() req: Request, @Body() data: UserRefreshTokenDto): Promise<LoginInfoUserDto | ApiResponse> {
        // treba nam refresh token

        const userToken = await this.userService.getUserToken(data.token);

        if (!userToken) {
            return new ApiResponse('error', - 4001, 'No such refresh token');
        }

        if (userToken.isValid === 0) {
            return new ApiResponse('error', - 4002, 'The token is no longer valid');
        }

        const sada = new Date();
        const datumIsteka = new Date(userToken.expiresAt);

        if (datumIsteka.getTime() < sada.getTime()) {
            return new ApiResponse('error', - 4003, 'The token has expired.');
        }

        let jwtRefreshData: JwtRefreshDataDto;

        try {
            jwtRefreshData = jwt.verify(data.token, jwtSecret);
        } catch (e) {
            throw new HttpException('Greška deserijalizacija', HttpStatus.UNAUTHORIZED);
        }

        if (!jwtRefreshData) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ip !== req.ip.toString()) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ua !== req.headers['user-agent']) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        const jwtData = new JwtDataUserDto();
               
        jwtData.userId = jwtRefreshData.userId;
        jwtData.username = jwtRefreshData.username;
        jwtData.role = jwtRefreshData.role;       
        jwtData.exp =  this.getDatePlus(60 * 5);
        jwtData.ip = jwtRefreshData.ip;
        jwtData.ua = jwtRefreshData.ua;

        // potpisivanje tokena //        
        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);


        const responseObject = new LoginInfoUserDto(
            jwtData.userId,
            jwtData.username,
            token,
            data.token,
            this.getIsoDate(jwtRefreshData.exp)
        );

        return responseObject;


    }

    private getDatePlus(seconds: number) {
        return new Date().getTime() / 1000 + seconds;
    }

    private getIsoDate(timestamp: number) {
        const date = new Date();
        date.setTime(timestamp * 1000);
        return date.toISOString();
    }

    private getDatebasedateFormat(isoFormat: string): string {
        return isoFormat.substr(0, 19).replace('T', ' ');
    }
    
}