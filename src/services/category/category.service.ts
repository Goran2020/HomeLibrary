import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Category } from "src/entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiResponse } from "src/misc/api.response";

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
    constructor(
        @InjectRepository(Category)
        private readonly category: Repository<Category>
    ) {
        super(category);
    }

    async getCategories(): Promise<Category[] | ApiResponse> {
        const categories = await this.category.find();
        if (categories.length === 0) {
            return new ApiResponse('ok', -4001, 'There is no users in database');
        }
        if (!categories) {
            return new ApiResponse('error', -4002, 'Cannot find any user');
        }

        return categories;
    }

    async getById(id: number): Promise<Category | ApiResponse> {
        const category = await this.category.findOne(id);

        if(!category) {
            return new ApiResponse('error', -4003, 'This category doesnt exists');
        }

        return category;
    }

   
}