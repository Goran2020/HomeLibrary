import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Author } from "src/entities/author.entity";
import { SingleAuthorDto } from "src/dtos/author/single-author.dto";
import { ApiResponse } from "src/misc/api.response";

@Injectable()
export class AuthorService extends TypeOrmCrudService<Author> {
    constructor(
        @InjectRepository(Author)
        private readonly author: Repository<Author>
    ) {
        super(author);
    }

    async getOneAuthor(data: SingleAuthorDto): Promise<Author | ApiResponse> {
        if (data.surname === '' || data.surname === '') {
            return new ApiResponse('error', -2002, 'Empty query');
        }
        
        const author = await this.author.findOne({
            forename: data.forename,
            surname: data.surname,
        })

        if (!author) {
            return new ApiResponse('error', -2001, 'Author doesnt exist');
        }

        return author;
    }

    async getAuthor(id: number) {
        const author = await this.author.findOne(id);

        if (!author) {
            return new ApiResponse('error', -2001, 'The Author doesnt exist.');
        }

        return author;
    }
}