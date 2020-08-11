import { Controller, Get, Post, Param, Body, UseGuards, Patch } from "@nestjs/common";
import { UserService } from "src/services/user/user.service";
import { ApiResponse } from "src/misc/api.response";
import { User } from "src/entities/user.entity";
import { EditUserDto } from "src/dtos/user/edit.user.dto";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Get()
    @UseGuards(RoleCheckerGuard)    
    @AllowToRoles('user')
    getUsers(): Promise<User[] | ApiResponse> {
        return this.userService.getAllUsers();
    }

    @Patch(':id')
    @UseGuards(RoleCheckerGuard) 
    @AllowToRoles('user')
    passwordChange(@Param('id') id: number, @Body() data: EditUserDto): Promise<User | ApiResponse> {
        return this.userService.editUser(id, data);
    }

    

}