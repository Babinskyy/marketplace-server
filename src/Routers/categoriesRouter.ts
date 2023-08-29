import express from "express";
import categoryController from "../Controllers/categoriesController";

const router = express.Router();

router.get("/", categoryController.index);

export default router;
