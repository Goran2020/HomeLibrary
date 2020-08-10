import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "src/services/user/user.service";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response";
import { AddUserDto } from "src/dtos/user/add.user.dto";

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
}