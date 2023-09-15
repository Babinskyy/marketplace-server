import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PORT, DATABASE_NAME } from "./src/config/env-variable";
import datasource from "./src/db/datasource";
import categoryRouter from "./src/Routers/CategoryRouter";
import offerRouter from "./src/Routers/OfferRouter";
import usersRouter from "./src/Routers/UsersRouter";
import getAzureImages from "./src/Controllers/GetAzureImages";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportConfig from "./src/config/passportConfig";
import authMiddle from "./src/middlewares/AuthMiddleware";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://marketplace.yan.software",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);
app.use((_req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://marketplace.yan.software"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/images/categories",
  express.static(path.join(__dirname, "images/categories"))
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript TypeORM Server");
});

app.use("/categories", categoryRouter);
app.use("/offers", authMiddle, offerRouter);
// app.use("/offers", offerRouter);
app.use("/users", usersRouter);

const getAzureData = async () => {
  try {
    const urls = await getAzureImages();
    console.log("Image URLs:", urls);
  } catch (error) {
    console.error("Error retrieving image URLs:", error);
  }
};
console.log(DATABASE_NAME);
// getAzureData();
let port = process.env.PORT || 8000;
(async () => {
  try {
    await datasource.initialize();
    if (datasource.isInitialized) {
      console.log(`Database ${DATABASE_NAME} connected`);

      app.listen(port, () =>
        // console.log(`Server is fire at: http://localhost:${PORT}/`)
        console.log(`Server is Fire`)
      );
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
