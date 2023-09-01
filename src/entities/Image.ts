import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export default class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "image", type: "bytea" })
  image: Buffer;
}
