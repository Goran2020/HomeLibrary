import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { BookAuthor } from "./book-author.entity";
import { Book } from "./book.entity";
import * as Validator from 'class-validator';

@Index("uq_author_forename_surname", ["forename", "surname"], { unique: true })
@Entity("author")
export class Author {
  @PrimaryGeneratedColumn({ type: "int", name: "author_id", unsigned: true })
  authorId: number;

  @Column({ 
    type: "varchar", 
    name: "forename", 
    length: 50
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 50)
  forename: string;

  @Column({ 
    type: "varchar", 
    name: "surname", 
    length: 50
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 50)
  surname: string;

  @OneToMany(
    () => BookAuthor,
    bookAuthor => bookAuthor.author
  )
  bookAuthors: BookAuthor[];

  @ManyToMany(type => Book, book => book.authors)
  @JoinTable({
    name: 'book_author',
    joinColumn: { name: 'author_id', referencedColumnName: 'authorId' },
    inverseJoinColumn: { name: 'book_id', referencedColumnName: 'bookId' }
  })
  books: Book[]
}
