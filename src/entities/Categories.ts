import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";


@Entity()
export default class Categories extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
  
  @Column()
  name: string;
}
