import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Photo } from "src/entities/photo.entity";
import { AddPhotoDto } from "src/dtos/photo/add.photo.dto";

@Injectable()
export class PhotoService extends TypeOrmCrudService<Photo> {
    constructor(
        @InjectRepository(Photo)
        private readonly photo: Repository<Photo>
    ) {
        super(photo);
    }

    async addPhoto(newPhoto: AddPhotoDto): Promise<Photo> {
        return await this.photo.save(newPhoto);
    }

    async deletePhotoById(photoId: number) {
        return await this.photo.delete(photoId);
    }
}