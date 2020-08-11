export class EditBookDto {
    
    title: string;
    originalTitle: string;
    publicationYear: number;
    pages: number;
    isbn: string;    
    language: string;
    isVisible: 0 | 1;
    catalogNumber: string;  
    categoryId: number;  
    publisherId: number;
    locationId: number;
    authors: {
        authorId: number;
        bookId: number;
    }[] | null;
}