import { DataSource, DataSourceOptions } from "typeorm";
import Users from "../entities/Users";
import Offers from "../entities/Offers";
import Categories from "../entities/Categories";
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
  entities: [Users, Offers, Categories],
  subscribers: [],
  migrations: [],
};

export default new DataSource(dataSourceOptions);
