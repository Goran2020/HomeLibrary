import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { Publisher } from "src/entities/publisher.entity";
import { PublisherService } from "src/services/publisher/publisher.service";

@Controller('api/publisher')
@Crud({
    model: {
        type: Publisher
    },
    params: {
        id: {
            field: 'publisherId',
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
                UseGuards(RoleCheckerGuard),
                AllowToRoles('user'),
            ]
        },
        getManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('user'),
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
export class PublisherController {
    constructor(
        public service: PublisherService
    ) {}
}