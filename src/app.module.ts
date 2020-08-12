import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Author } from './entities/author.entity';
import { BookAuthor } from './entities/book-author.entity';
import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';
import { Photo } from './entities/photo.entity';
import { Publisher } from './entities/publisher.entity';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/api/user.controller';
import { User } from './entities/user.entity';
import { Location } from './entities/location.entity';
import { AuthController } from './controllers/api/auth.controller';
import { CategoryController } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';
import { AuthorService } from './services/author/author.service';
import { AuthorController } from './controllers/api/author.controller';
import { BookService } from './services/book/book.service';
import { BookController } from './controllers/api/book.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PhotoService } from './services/photo/photo.service';
import { UserToken } from './entities/user-token.entity';

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
        UserToken
      ]
    }),
    TypeOrmModule.forFeature([
      User,
      Category,
      Author,
      Book,
      BookAuthor,
      Photo,
      UserToken
    ])
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    CategoryController,
    AuthorController,
    BookController,
    AuthController,
  ],
  providers: [
    UserService,
    CategoryService,
    AuthorService,
    BookService,
    PhotoService
  ],
  exports: [
    UserService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('auth/*').forRoutes("api/*");
  }
}
