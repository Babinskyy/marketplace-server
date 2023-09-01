import express from "express";
import categoryController from "../Controllers/CategoryController";

const router = express.Router();

router.get("/", categoryController.index);

export default router;
