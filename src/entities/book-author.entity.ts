import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Author } from "./author.entity";
import { Book } from "./book.entity";

@Index("uq_book_author_book_id_author_id", ["bookId", "authorId"], {
  unique: true
})
@Index("fk_book_author_author_id", ["authorId"], {})
@Entity("book_author")
export class BookAuthor {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "book_author_id",
    unsigned: true
  })
  bookAuthorId: number;

  @Column({ 
    type: "int", 
    name: "book_id", 
    unsigned: true
  })
  bookId: number;

  @Column({ 
    type: "int", 
    name: "author_id", 
    unsigned: true
  })
  authorId: number;

  @ManyToOne(
    () => Author,
    author => author.bookAuthors,
    { onDelete: "RESTRICT", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "author_id", referencedColumnName: "authorId" }])
  author: Author;

  @ManyToOne(
    () => Book,
    book => book.bookAuthors,
    { onDelete: "RESTRICT", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "book_id", referencedColumnName: "bookId" }])
  book: Book;
}
