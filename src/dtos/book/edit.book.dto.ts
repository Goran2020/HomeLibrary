import * as Validator from 'class-validator';

export class EditBookDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    title: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    originalTitle: string;

    
    publicationYear: number;

    
    pages: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(13)
    isbn: string;    
    
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 30)
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