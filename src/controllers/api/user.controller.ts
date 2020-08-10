import { Controller, Get } from "@nestjs/common";
import { UserService } from "src/services/user/user.service";
import { ApiResponse } from "src/misc/api.response";
import { User } from "src/entities/user.entity";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Get()
    getUsers(): Promise<User[] | ApiResponse> {
        return this.userService.getAllUsers();
    }
}