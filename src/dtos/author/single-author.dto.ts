import * as Validator from 'class-validator';

export class SingleAuthorDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    forename: string;
    
    @Validator.IsNotEmpty()
    @Validator.IsString()
    surname: string;
}