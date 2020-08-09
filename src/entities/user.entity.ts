import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_user_username", ["username"], { unique: true })
@Entity("user", { schema: "library" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column({
    type: "varchar", 
    name: "username",
    unique: true,
    length: 50
  })
  username: string;

  @Column({
    type: "varchar", 
    name: "password_hash",
    length: 128
  })
  passwordHash: string;
}
