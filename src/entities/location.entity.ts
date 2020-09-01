import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Book } from "./book.entity";
import * as Validator from 'class-validator';

@Index("uq_location_room_shelf", ["room", "shelf"], { unique: true })
@Entity("location", { schema: "library" })
export class Location {
  @PrimaryGeneratedColumn({ type: "int", name: "location_id", unsigned: true })
  locationId: number;

  @Column({ 
    type: "varchar", 
    name: "room", 
    length: 30
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 30)
  room: string;

  @Column({ 
    type: "varchar", 
    name: "shelf", 
    length: 20
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 20)
  shelf: string;

  @OneToMany(
    () => Book,
    book => book.location
  )
  books: Book[];
}
