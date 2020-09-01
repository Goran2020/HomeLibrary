import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Category } from "./category.entity";
import { Location } from "./location.entity";
import { Publisher } from "./publisher.entity";
import { BookAuthor } from "./book-author.entity";
import { Photo } from "./photo.entity";
import { Author } from "./author.entity";
import * as Validator from 'class-validator';

@Index("uk_book_isbn", ["isbn"], { unique: true })
@Index("uq_book_catalog_number", ["catalogNumber"], { unique: true })
@Index("fk_book_category_id", ["categoryId"], {})
@Index("fk_book_publisher_id", ["publisherId"], {})
@Index("fk_book_location_id", ["locationId"], {})
@Entity("book")
export class Book {
  @PrimaryGeneratedColumn({ type: "int", name: "book_id", unsigned: true })
  bookId: number;

  @Column({ 
    type: "varchar", 
    name: "title", 
    length: 64
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 64) 
  title: string;

  @Column({
    type: "varchar", 
    name: "original_title",
    length: 64
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 64)
  originalTitle: string;

  @Column({
    type: "smallint", 
    name: "publication_year",
    unsigned: true
  })  
  @Validator.IsNotEmpty()  
  publicationYear: number;

  @Column({ 
    type: "smallint", 
    name: "pages", 
    unsigned: true
  })
  @Validator.IsNotEmpty()   
  pages: number;

  @Column({
    type: "varchar", 
    name: "isbn",
    unique: true,
    length: 13
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(13)
  isbn: string;

  @Column({ 
    type: "varchar", 
    name: "language", 
    length: 30
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 30)
  language: string;

  @Column({
    type: "varchar", 
    name: "catalog_number",
    unique: true,
    length: 10
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1, 10)
  catalogNumber: string;

  @Column({ 
    type: "smallint", 
    name: "is_visible", 
    unsigned: true
  })  
  isVisible: number;

  @Column({ 
    type: "int", 
    name: "category_id", 
    unsigned: true
  })
  categoryId: number;

  @Column({ 
    type: "int", 
    name: "publisher_id", 
    unsigned: true
  })
  publisherId: number;

  @Column({ 
    type: "int", 
    name: "location_id", 
    unsigned: true
  })
  locationId: number;

  @ManyToOne(
    () => Category,
    category => category.books,
    { onDelete: "RESTRICT", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @ManyToOne(
    () => Location,
    location => location.books,
    { onDelete: "RESTRICT", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "location_id", referencedColumnName: "locationId" }])
  location: Location;

  @ManyToOne(
    () => Publisher,
    publisher => publisher.books,
    { onDelete: "RESTRICT", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "publisher_id", referencedColumnName: "publisherId" }])
  publisher: Publisher;

  @OneToMany(
    () => BookAuthor,
    bookAuthor => bookAuthor.book
  )
  bookAuthors: BookAuthor[];

  @OneToMany(
    () => Photo,
    photo => photo.book
  )
  photos: Photo[];

  @ManyToMany(type => Author, author => author.books)
  @JoinTable({
    name: 'book_author',
    joinColumn: { name: 'book_id', referencedColumnName: 'bookId' },
    inverseJoinColumn: { name: 'author_id', referencedColumnName: 'authorId' }
  })
  authors: Author[]
}


