import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PORT, DATABASE_NAME } from "./src/config/env-variable";
import datasource from "./src/db/datasource";
import categoryRouter from "./src/Routers/CategoryRouter";
import offerRouter from "./src/Routers/OfferRouter";
import Image from "./src/entities/Image";
import getAzureImages from "./src/Controllers/GetAzureImages";
import multer from 'multer';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript TypeORM Server");
});

app.use("/categories", categoryRouter);
app.use("/offers", offerRouter);


const main = async () => {
  try {
    const urls = await getAzureImages();
    console.log('Image URLs:', urls);
  } catch (error) {
    console.error('Error retrieving image URLs:', error);
  }
};
// main();


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
