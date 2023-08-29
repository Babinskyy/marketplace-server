import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from "typeorm";

@Entity()
export default class Offers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    array: true
  })
  images: string[];

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  date: string;

  @Column()
  author: string;

  @Column()
  country: string;

  @Column()
  phone: string;

  @Column()
  category: string;
}