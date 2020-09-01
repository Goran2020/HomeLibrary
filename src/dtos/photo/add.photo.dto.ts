import * as Validator from 'class-validator';

export class AddPhotoDto {
    bookId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(1, 128)    
    imagePath: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.IsIn(["front", "back"])
    cover: 'front' | 'back';
    
}