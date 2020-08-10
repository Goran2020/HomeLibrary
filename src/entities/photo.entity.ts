import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Book } from "./book.entity";

@Index("uq_photo_book_id_cover", ["bookId", "cover"], { unique: true })
@Index("uq_image_path", ["imagePath"], { unique: true })
@Entity("photo")
export class Photo {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column("int", { name: "book_id", unsigned: true, default: () => "'0'" })
  bookId: number;

  @Column({
    type: "enum", 
    name: "cover",
    enum: ["front", "back"],
    default: () => "'front'"
  })
  cover: "front" | "back";

  @Column({
    type: "varchar", 
    name: "image_path",
    unique: true,
    length: 128
  })
  imagePath: string;

  @ManyToOne(
    () => Book,
    book => book.photos,
    { onDelete: "RESTRICT", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "book_id", referencedColumnName: "bookId" }])
  book: Book;
}
