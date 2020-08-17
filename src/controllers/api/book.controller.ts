import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, Req, Delete, Patch, UseGuards } from "@nestjs/common";
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
import { EditBookDto } from "src/dtos/book/edit.book.dto";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { BookSearchDto } from "src/dtos/book/book.search.dto";



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
            },
            location: {
                eager: true
            },
            publisher: {
                eager: true
            }
        }
    },
    routes: {
        only: [
            'getOneBase',
            'getManyBase'
        ],
        getOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('user')
            ]
        },
        getManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('user')
            ]
        }
    }
})
export class BookController {
    constructor(
        public service: BookService,
        public photoService: PhotoService
    ) {}

    
    @Post('createBook')
    @UseGuards(RoleCheckerGuard)    
    @AllowToRoles('user')
    createBook(@Body() data: AddBookDto) {
        return this.service.createBook(data);
    }

    
    @Patch(':id')
    @UseGuards(RoleCheckerGuard)    
    @AllowToRoles('user')
    async editBook(@Param('id') id: number, @Body() data: EditBookDto): Promise<Book | ApiResponse> {
        return await this.service.editBook(id, data);
    }


    
    @Post(':id/uploadPhoto')
    @UseGuards(RoleCheckerGuard)    
    @AllowToRoles('user')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photo.destination,
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
                fileSize: StorageConfig.photo.maxFileSize,
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
        await this.createResizedImage(photo, StorageConfig.photo.resize.thumb)
    }

    async createSmall(photo) {
        await this.createResizedImage(photo, StorageConfig.photo.resize.small)
    }

    async createResizedImage(photo, resizeSettings) {
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = 
            StorageConfig.photo.destination + 
            resizeSettings.directory + 
            fileName;

        await sharp(originalFilePath)
            .resize({
                fit: 'cover',
                width: resizeSettings.width,
                height: resizeSettings.height
            })
            .toFile(destinationFilePath);
    }

    
    @Delete(':bookId/deletePhoto/:photoId')
    @UseGuards(RoleCheckerGuard)    
    @AllowToRoles('user')
    public async deletePhoto(@Param('bookId') delBookId: number, @Param('photoId') delPhotoId: number) {
        const photo = await this.photoService.findOne({
            bookId: delBookId,
            photoId: delPhotoId
        })

        if (!photo) {
            return new ApiResponse('error', -6001, 'Photo not found.')
        }

        try {
            fs.unlinkSync(StorageConfig.photo.destination + photo.imagePath);
            fs.unlinkSync(StorageConfig.photo.destination + 
                          StorageConfig.photo.resize.thumb.directory +
                          photo.imagePath);
            fs.unlinkSync(StorageConfig.photo.destination + 
                          StorageConfig.photo.resize.small.directory +
                          photo.imagePath)
        } catch (e) {
            return new ApiResponse('error', -6002, e);
        }

        const result = await this.photoService.deletePhotoById(delPhotoId);

        if (result.affected === 0) {
            return new ApiResponse('error', -6003, 'Photo cant be deleted');
        }

        return new ApiResponse('ok', 0, 'One photo deleted!');
    }

    @Post('search')
    async search(@Body() data: BookSearchDto): Promise<Book[] | ApiResponse> {
        return await this.service.search(data);
    }
    

}