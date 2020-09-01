import * as Validator from 'class-validator';

export class AddBookDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    title: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    originalTitle: string;

    @Validator.IsNotEmpty()    
    publicationYear: number;

    @Validator.IsNotEmpty()   
    pages: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(13)
    isbn: string;
    
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 30)
    language: string; 
    
    
    categoryId: number;  
    publisherId: number;
    locationId: number;
    authors: {
        authorId: number;        
    }[];
}