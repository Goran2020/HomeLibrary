import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_book_author_book_id_author_id", ["bookId", "authorId"], {
  unique: true
})
@Entity("book_author", { schema: "library" })
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
}
