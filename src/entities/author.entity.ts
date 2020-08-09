import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

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
  forename: string;

  @Column({
    type: "varchar", 
    name: "surname", 
    length: 50
  })
  surname: string;
}
