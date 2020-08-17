import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { Location } from "src/entities/location.entity";
import { LocationService } from "src/services/location/location.service";

@Controller('api/location')
@Crud({
    model: {
        type: Location
    },
    params: {
        id: {
            field: 'locationId',
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
export class LocationrController {
    constructor(
        public service: LocationService
    ) {}
}