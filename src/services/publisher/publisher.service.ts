import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Publisher } from "src/entities/publisher.entity";

@Injectable()
export class PublisherService extends TypeOrmCrudService<Publisher> {
    constructor(
        @InjectRepository(Publisher)
        private readonly publisher: Repository<Publisher>
    ) {
        super(publisher);
    }
}