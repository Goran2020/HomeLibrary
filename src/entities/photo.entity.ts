import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_photo_book_id_cover", ["bookId", "cover"], { unique: true })
@Index("uq_image_path", ["imagePath"], { unique: true })
@Entity("photo", { schema: "library" })
export class Photo {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column({ 
    type: "int", 
    name: "book_id", 
    unsigned: true
  })
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
}
