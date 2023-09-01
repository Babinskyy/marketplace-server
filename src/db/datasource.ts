import { DataSource, DataSourceOptions } from "typeorm";
import User from "../entities/User";
import Offer from "../entities/Offer";
import Category from "../entities/Category";
import Image from "../entities/Image";
import {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} from "../config/env-variable";

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Offer, Category, Image],
  subscribers: [],
  migrations: [],
};

export default new DataSource(dataSourceOptions);
