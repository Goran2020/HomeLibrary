import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Category } from "src/entities/category.entity";
import { CategoryService } from "src/services/category/category.service";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

@Controller('api/category')
@Crud({
    model: {
        type: Category
    },
    params: {
        id: {
            field: 'categoryId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
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
export class CategoryController {
    constructor(
        public service: CategoryService
    ) {}
}