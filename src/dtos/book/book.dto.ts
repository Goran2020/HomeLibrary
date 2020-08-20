export class BookDto {
    title: string;
    originalTitle: string;
    publicationYear: number;
    pages: number;
    isbn: string;    
    language: string;
    isVisible: number;
    catalogNumber: string;  
    categoryId: number;  
    publisherId: number;
    locationId: number;
    authors: {
        authorId: number;
        forename: string;
        surname: string;
    }[] | null;
    photos: {
        photoId: number,
        bookId: number;
        cover: string;
        imagepath: string;
    }
}