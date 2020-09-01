import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Book } from "./book.entity";
import * as Validator from 'class-validator';

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
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 50)
  name: string;

  @OneToMany(
    () => Book,
    book => book.category
  )
  books: Book[];
}
