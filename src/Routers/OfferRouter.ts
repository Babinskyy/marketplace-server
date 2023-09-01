import express from "express";
import offerController from "../Controllers/OfferController";

const router = express.Router();

router.get("/", offerController.index);
router.post("/upload", offerController.upload);
router.post("/create", offerController.create);
// router.post("/images", offerController.images);


export default router;
