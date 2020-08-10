export class AddBookDto {
    
    title: string;
    originalTitle: string;
    publicationYear: number;
    pages: number;
    isbn: string;    
    language: string;  
    categoryId: number;  
    publisherId: number;
    locationId: number;
    authors: {
        authorId: number;
        bookId: number;
    }[];
}