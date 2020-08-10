import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { UserService } from "src/services/user/user.service";
import { ApiResponse } from "src/misc/api.response";
import { User } from "src/entities/user.entity";
import { EditUserDto } from "src/dtos/user/edit.user.dto";

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Get()
    getUsers(): Promise<User[] | ApiResponse> {
        return this.userService.getAllUsers();
    }

    @Post(':id')
    passwordChange(@Param('id') id: number, @Body() data: EditUserDto): Promise<User | ApiResponse> {
        return this.userService.editUser(id, data);
    }

    

}