import { Controller, UseGuards, Body, Post } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Author } from "src/entities/author.entity";
import { AuthorService } from "src/services/author/author.service";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { SingleAuthorDto } from "src/dtos/author/single-author.dto";
import { ApiResponse } from "src/misc/api.response";



@Controller('api/author')
@Crud({
    model: {
        type: Author
    },
    params: {
        id: {
            field: 'authorId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            bookAuthors: {
                eager: false
            },
            books: {
                eager: true
            }
        }
    },
    routes: {
        only: [ 
            "createOneBase", 
            "createManyBase", 
            "getManyBase", 
            "getOneBase", 
            "updateOneBase"
        ],
        createOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('user')
            ]
        },
        createManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('user'),
            ]
        },
        getOneBase: {
            decorators: [
                //UseGuards(RoleCheckerGuard),
                //AllowToRoles('user'),
            ]
        },
        getManyBase: {
            decorators: [
                //UseGuards(RoleCheckerGuard),
                //AllowToRoles('user'),
            ]
        },
        updateOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('user'),
            ] 
        }
    }
})
export class AuthorController {
    constructor(
        public service: AuthorService
    ) {}


    @Post('findOne')
    async getAuthorByForenameAndSurname(@Body() data: SingleAuthorDto): Promise<Author | ApiResponse> {
        return this.service.getOneAuthor(data);
    }
    
}