import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Author } from "src/entities/author.entity";
import { AuthorService } from "src/services/author/author.service";



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
    }
})
export class AuthorController {
    constructor(
        public service: AuthorService
    ) {}
}