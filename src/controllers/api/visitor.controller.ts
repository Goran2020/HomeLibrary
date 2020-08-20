import { Controller, Get, Param, Body, Post } from "@nestjs/common";
import { CategoryService } from "src/services/category/category.service";
import { ApiResponse } from "src/misc/api.response";
import { Category } from "src/entities/category.entity";
import { Book } from "src/entities/book.entity";
import { BookSearchDto } from "src/dtos/book/book.search.dto";
import { BookService } from "src/services/book/book.service";
import { Author } from "src/entities/author.entity";
import { AuthorService } from "src/services/author/author.service";
import { SingleAuthorDto } from "src/dtos/author/single-author.dto";
import { BookDto } from "src/dtos/book/book.dto";

@Controller('visitor/')
export class VisitorControler {

    constructor(
        private readonly categoryService: CategoryService,
        private readonly bookService: BookService,
        private readonly authorService: AuthorService
    ) {}
        
    @Get('category')
    async getCategories(): Promise<Category[] | ApiResponse> {        
        return await this.categoryService.getCategories();
    }

    @Get('category/:id')
    async getById(@Param('id') id: number): Promise<Category | ApiResponse> {
        return await this.categoryService.getById(id);
    }

    @Post('search')
    async search(@Body() data: BookSearchDto): Promise<Book[] | ApiResponse> {
        return await this.bookService.search(data);
    }

    @Get('book/:id') 
    async getBook(@Param('id') id: number): Promise<Book | ApiResponse> {
        return await this.bookService.getBook(id);
      
    }

    @Post('findOne')
    async getAuthorByForenameAndSurname(@Body() data: SingleAuthorDto): Promise<Author | ApiResponse> {
        return this.authorService.getOneAuthor(data);
    }
    
}