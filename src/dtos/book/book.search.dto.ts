import { BookSearchAuthorComponentDto } from "./book.search.author.component.dto";

export class BookSearchDto {
    categoryId: number;
    keywords: string;
    title: string;
    publicationYear: number;
    authorId: number; 
    //authors: BookSearchAuthorComponentDto[];
    orderBy: 'title' | 'year';
    orderDirection: 'ASC' | 'DESC';
    page: number;
    itemsPerPage: 5 | 10 | 20 | 50;
}