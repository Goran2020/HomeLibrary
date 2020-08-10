import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Book } from "./book.entity";

@Index("uq_category_name", ["name"], { unique: true })
@Entity("category")
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column({
    type: "varchar", 
    name: "name",
    unique: true,
    length: 50
  })
  name: string;

  @OneToMany(
    () => Book,
    book => book.category
  )
  books: Book[];
}
