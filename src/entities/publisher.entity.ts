import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Book } from "./book.entity";

@Index("uq_publisher_name", ["name"], { unique: true })
@Entity("publisher", { schema: "library" })
export class Publisher {
  @PrimaryGeneratedColumn({ type: "int", name: "publisher_id", unsigned: true })
  publisherId: number;

  @Column({
    type: "varchar", 
    name: "name",
    unique: true,
    length: 50
  })
  name: string;

  @Column({ 
    type: "varchar", 
    name: "city", 
    length: 50
  })
  city: string;

  @Column({ 
    type: "varchar", 
    name: "state", 
    length: 64
  })
  state: string;

  @Column({
    type: "smallint", 
    name: "founded_in",
    unsigned: true
  })
  foundedIn: number;

  @OneToMany(
    () => Book,
    book => book.publisher
  )
  books: Book[];
}
