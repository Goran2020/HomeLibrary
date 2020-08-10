import { Controller, Post, Body } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Book } from "src/entities/book.entity";
import { BookService } from "src/services/book/book.service";
import { AddBookDto } from "src/dtos/book/add.book.dto";

@Controller('api/book')
@Crud({
    model: {
        type: Book
    },
    params: {
            id: {
                field: 'bookId',
                type: 'number',
                primary: true
            }
    },
    query: {
        join: {
            authors: {
                eager: true
            },
            category: {
                eager: true
            }
        }
    }
})
export class BookController {
    constructor(
        public service: BookService
    ) {}

    @Post('createBook')
    createBook(@Body() data: AddBookDto) {
        return this.service.createBook(data);
    }
}