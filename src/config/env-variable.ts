import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV
export const MY_SETTING = process.env.MY_SETTING

//db config
export const DATABASE_HOST = process.env.DATABASE_HOST ?? "";
export const DATABASE_PORT = Number(process.env.DATABASE_PORT) ?? 5432;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME ?? "";
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD ?? "";
export const DATABASE_NAME = process.env.DATABASE_NAME ?? "";
