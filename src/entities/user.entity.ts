import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import * as Validator from 'class-validator';

@Index("uq_user_username", ["username"], { unique: true })
@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column({
    type: "varchar", 
    name: "username",
    unique: true,
    length: 50
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(4, 50)
  username: string;

  @Column({
    type: "varchar", 
    name: "password_hash",
    length: 128
  })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;
}
