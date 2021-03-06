import { NestMiddleware, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/services/user/user.service";
import * as jwt from 'jsonwebtoken';
import { JwtDataUserDto } from "src/dtos/user/jwt.data.user.dto";
import { jwtSecret } from "config/jwt.secret";
import { User } from "src/entities/user.entity";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService
    ) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        
        
        if (!req.headers.authorization) {  // u hederu nema authorization token
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        }

        const token = req.headers.authorization;

        const tokenParts = token.split(' ');

        if (tokenParts.length !== 2) {
            throw new HttpException('TokenParts !== 2', HttpStatus.UNAUTHORIZED);
        }

        const tokenString = tokenParts[1];

        let jwtData: JwtDataUserDto;

        // deserijalizacija radi upoređivanja
        try {
            jwtData = jwt.verify(tokenString, jwtSecret);
        } catch (e) {
            throw new HttpException('Greška deserijalizacija', HttpStatus.UNAUTHORIZED);
        }

        
        
        // console.log(jwtData);

        if (!jwtData) {
            throw new HttpException('Nema jwtData', HttpStatus.UNAUTHORIZED);
        }

        if (jwtData.role === "user") {
            const user: User = await this.userService.getById(jwtData.userId);

            if (!user) {
                throw new HttpException('Account not found.', HttpStatus.UNAUTHORIZED);
            }
        }

        if (jwtData.ip !== req.ip.toString()) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtData.ua !== req.headers['user-agent']) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }
        //  console.log(jwtData.userId);
        

        let sada = new Date();

        const trenutniTimestapm = sada.getTime() / 1000;

        if (trenutniTimestapm >= jwtData.exp) {
            throw new HttpException('The token has expired.', HttpStatus.UNAUTHORIZED);
        }

        req.token = jwtData;

        next();
    }

}