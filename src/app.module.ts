import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Author } from './entities/author.entity';
import { BookAuthor } from './entities/book-author.entity';
import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';
import { Photo } from './entities/photo.entity';
import { Publisher } from './entities/publisher.entity';
import { User } from './entities/user.entity';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/api/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Author,
        BookAuthor,
        Book,
        Category,
        Location,
        Photo,
        Publisher,
        User,
      ]
    }),
    TypeOrmModule.forFeature([
      User,
    ])
  ],
  controllers: [
    AppController,
    UserController,
  ],
  providers: [UserService],
})
export class AppModule {}
