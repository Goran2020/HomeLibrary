import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "src/entities/book.entity";
import { AddBookDto } from "src/dtos/book/add.book.dto";
import { ApiResponse } from "src/misc/api.response";
import { BookAuthor } from "src/entities/book-author.entity";
import { EditBookDto } from "src/dtos/book/edit.book.dto";

@Injectable()
export class BookService extends TypeOrmCrudService<Book> {
    constructor(
        @InjectRepository(Book)
        private readonly book: Repository<Book>,

        @InjectRepository(BookAuthor)
        private readonly bookAuthor: Repository<BookAuthor>
    ) {
        super(book);
    }

    async createBook(data: AddBookDto): Promise<Book | ApiResponse> {
        let newBook: Book = new Book();

        newBook.title = data.title;
        newBook.originalTitle = data.originalTitle;
        newBook.publicationYear = data.publicationYear;
        newBook.pages = data.pages;
        newBook.isbn = data.isbn;
        newBook.language = data.language;
        newBook.categoryId = data.categoryId;
        newBook.publisherId = data.publisherId;
        newBook.locationId = data.locationId;

        let now = new Date();
        let catalogNo: string = '';
        catalogNo += (Math.random() * now.getFullYear()).toFixed(0).toString();
        catalogNo += now.getMonth() + 10;
        catalogNo += now.getDay() + 10;
        catalogNo += now.getDate() + 10
        
        newBook.catalogNumber = String(catalogNo);

        let savedBook = await this.book.save(newBook);

        for (let author of data.authors) {
            let newBookAuthor: BookAuthor = new BookAuthor();
            newBookAuthor.authorId = author.authorId;
            newBookAuthor.bookId = savedBook.bookId;

            await this.bookAuthor.save(newBookAuthor);
        }

        return await this.book.findOne(savedBook.bookId, {
            relations: [
                "category",
                "authors"
            ]
        })
        
    }

    async editBook(bookId: number, data: EditBookDto): Promise<Book | ApiResponse> {
        const book: Book = await this.book.findOne(bookId, {
            relations: [
                "bookAuthors"
            ]
        });

        // console.log(book);
        if (!book) {
            return new ApiResponse('error', -5001);
        }

        book.title = data.title;
        book.originalTitle = data.originalTitle;
        book.publicationYear = data.publicationYear,
        book.pages = data.pages;
        book.isbn = data.isbn;
        book.isVisible = data.isVisible;
        book.language = data.language;
        book.catalogNumber = data.catalogNumber;
        book.categoryId = data.categoryId;
        book.publisherId = data.publisherId;
        book.locationId = data.locationId;

        const savedBook = await this.book.save(book);

        if (!savedBook) {
            return new ApiResponse('error', -5002, 'Book cannot be edited');
        }

        if (data.authors !== null) {
            await this.bookAuthor.remove(savedBook.bookAuthors);

            for (let author of data.authors) {
                let newBookAuthor: BookAuthor = new BookAuthor();
                newBookAuthor.bookId = bookId;
                newBookAuthor.authorId = author.authorId;

                await this.bookAuthor.save(newBookAuthor);
            }
        }

        return await this.book.findOne(bookId, {
            relations: [
                "bookAuthors",
                "category"
            ]
        });


    }
}