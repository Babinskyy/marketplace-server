import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Category from "./Category";
import Users from "./Users";

@Entity()
export default class Offer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    array: true,
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

  @ManyToOne(() => Category, (category) => category.offers)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @ManyToOne(() => Users, (users) => users.offers)
  @JoinColumn({ name: "user_id" })
  user: Users;
}
