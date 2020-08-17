import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Location } from "src/entities/location.entity";

@Injectable()
export class LocationService extends TypeOrmCrudService<Location> {
    constructor(
        @InjectRepository(Location)
        private readonly location: Repository<Location>
    ) {
        super(location);
    }
}