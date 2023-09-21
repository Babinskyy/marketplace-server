import express from "express";
import categoryController from "../controllers/CategoryController";

const router = express.Router();

router.get("/", categoryController.index);

export default router;
