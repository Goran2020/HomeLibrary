import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Book } from "src/entities/book.entity";
import { AddBookDto } from "src/dtos/book/add.book.dto";
import { ApiResponse } from "src/misc/api.response";
import { BookAuthor } from "src/entities/book-author.entity";
import { EditBookDto } from "src/dtos/book/edit.book.dto";
import { BookSearchDto } from "src/dtos/book/book.search.dto";

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

    async search(data: BookSearchDto): Promise<Book[] | ApiResponse> {
        const builder = await this.book.createQueryBuilder('book');

        builder.innerJoinAndSelect("book.bookAuthors", "bba");
        builder.innerJoinAndSelect('book.authors', "ba");
        builder.where('book.categoryId = :id', { id: data.categoryId });
        
        if(data.title) {
            builder.andWhere('book.title = :title', { title: data.title });
        }
        
        /*
        if(data.title && data.title.length > 0) {
            builder.andWhere('book.title = :title', { title: data.title.trim() });
        }
        */ 
        if (data.keywords && data.keywords.length > 0) {
            builder.andWhere('book.title LIKE :kw', { kw: "%" + data.keywords.trim() + "%"})
        }

        if (data.publicationYear && typeof data.publicationYear === 'number') {
            builder.andWhere('book.publicationYear = :yearMax', { yearMax: data.publicationYear })
        }

        if (data.authors && data.authors.length > 0) {
            for (const author of data.authors) {
                builder.andWhere('bba.author_id = :aId', { aId: author.authorId });
            }
            
        }

        let orderBy = 'book.title';
        let orderDirection: 'ASC' | 'DESC' = 'ASC';

        if (data.keywords && data.orderBy) {
            orderBy = data.orderBy;
        }

        if (data.keywords && data.orderDirection) {
            orderDirection = data.orderDirection;
        }

        builder.orderBy(orderBy, orderDirection);

        let itemsIds = await (await builder.getMany()).map(book => book.bookId);

        if (itemsIds.length === 0) {
            return new ApiResponse('ok', 0, 'No books found.');
        }

        return await this.book.find({
            where: {
                bookId: In(itemsIds)
            },
            relations: [
                "photos",
                "authors",
                "category"
            ]
        });
    }

}