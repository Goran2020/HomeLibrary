import { SetMetadata } from "@nestjs/common"

export const AllowToRoles = (role: ('user')) => {
    return SetMetadata('allow_to_roles', role);
}