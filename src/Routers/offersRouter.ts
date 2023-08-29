import express from "express";
import offersController from "../Controllers/offersController";

const router = express.Router();

router.get("/", offersController.index);

export default router;
