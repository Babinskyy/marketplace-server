import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PORT, DATABASE_NAME } from "./src/config/env-variable";
import datasource from "./src/db/datasource";
import categoriesRouter from "./src/Routers/categoriesRouter";
import offersRouter from "./src/Routers/offersRouter";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript TypeORM Server");
});

app.use("/categories", categoriesRouter);
app.use("/offers", offersRouter);

(async () => {
  try {
    await datasource.initialize();
    if (datasource.isInitialized) {
      console.log(`Database ${DATABASE_NAME} connected`);
      app.listen(PORT, () =>
        console.log(`Server is running at: http://localhost:${PORT}/`)
      );
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
