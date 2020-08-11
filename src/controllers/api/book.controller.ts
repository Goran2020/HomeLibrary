import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Book } from "src/entities/book.entity";
import { BookService } from "src/services/book/book.service";
import { AddBookDto } from "src/dtos/book/add.book.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { StorageConfig } from "config/storage.config";
import { PhotoService } from "src/services/photo/photo.service";
import { Photo } from "src/entities/photo.entity";
import { ApiResponse } from "src/misc/api.response";
import { AddPhotoDto } from "src/dtos/photo/add.photo.dto";
import * as fileType from 'file-type';
import * as fs from 'fs'
import * as sharp from 'sharp';

@Controller('api/book')
@Crud({
    model: {
        type: Book
    },
    params: {
            id: {
                field: 'bookId',
                type: 'number',
                primary: true
            }
    },
    query: {
        join: {
            authors: {
                eager: true
            },
            category: {
                eager: true
            },
            photos: {
                eager: true
            }
        }
    }
})
export class BookController {
    constructor(
        public service: BookService,
        public photoService: PhotoService
    ) {}

    @Post('createBook')
    createBook(@Body() data: AddBookDto) {
        return this.service.createBook(data);
    }

    @Post(':id/uploadPhoto')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photoDestination,
                filename: (req, file, callback) => {
                    let original = file.originalname;
                    let normalized = original.replace(/\s+/g, '-');
                    let sada = new Date();
                    let namePart = "";
                    namePart += sada.getFullYear().toString();
                    namePart += (sada.getMonth() + 1).toString();
                    namePart += sada.getDate().toString();

                    let rndArrElem = 
                        new Array(10)
                        .fill('')
                        .map(e => (Math.random() * 9).toFixed(0).toString()).join('');
                    
                    let fullName = namePart + "-" + rndArrElem + "-" + normalized;

                    callback(null, fullName);
                }
            }),
            fileFilter: (req, file, callback) => {

                // proveri ekstenziju // 
                if (!file.originalname.toLowerCase().match(/\.(jpg|png)$/)) {
                    req.fileFilterError = 'Bad file extension!'; // mi dodajemo property
                    callback(null, false);
                    return;
                }

                // proveri mimetype, tip sadržaja //
                if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
                    req.fileFilterError = 'Bad file extension!';
                    callback(null, false);
                    return;
                }

                callback(null, true);
            },
            limits: {
                files: 1,
                fileSize: StorageConfig.maxFileSize,
            }
        })
    )
    async uploadPhoto(
        @Param('id') bookId: number, 
        @UploadedFile() photo, 
        @Req() req,
        @Body() data: AddPhotoDto,
        
    ): Promise<Photo | ApiResponse> {
                                                                  // include-ujemo request
        if (req.fileFilterError) {
            return new ApiResponse('error', -7002, req.fileFilterError);
        }
        
        if (!photo) {
            return new ApiResponse('error', -7003, 'File not uploaded!');
        }
        
        const fileTypeResult = await fileType.fromFile(photo.path);

        if (!fileTypeResult) {
            fs.unlinkSync(photo.path);
            return new ApiResponse('error', -7004, 'Cannot detect file type!');
        }

        const realMimeType = fileTypeResult.mime;

        if (!(realMimeType.includes('jpeg') || realMimeType.includes('png'))) {
            fs.unlinkSync(photo.path);
            return new ApiResponse('error', -7005, 'Bad file content type!');
        }

        await this.createThumb(photo);
        await this.createSmall(photo);

        const newPhoto: Photo = new Photo();        
        newPhoto.bookId = bookId;       
        newPhoto.imagePath = photo.filename;
        newPhoto.cover = data.cover;
        //console.log(newPhoto);
        const savedPhoto = await this.photoService.addPhoto(newPhoto);

        if (!savedPhoto) {
            return new ApiResponse('error', -7001);
        }

        return savedPhoto;
    }

    async createThumb(photo) {
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.photoDestination + "thumb/" + fileName;
        await sharp(originalFilePath)
            .resize({
                fit: 'cover',
                width: StorageConfig.photoThumbSize.width,
                height: StorageConfig.photoThumbSize.height
            })
            .toFile(destinationFilePath);
    }

    async createSmall(photo) {
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.photoDestination + "small/" + fileName;
        await sharp(originalFilePath)
            .resize({
                fit: 'cover',
                width: StorageConfig.photoSmallSize.width,
                height: StorageConfig.photoSmallSize.height
            })
            .toFile(destinationFilePath);
    }
}