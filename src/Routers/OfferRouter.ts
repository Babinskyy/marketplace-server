import express from "express";
import offerController from "../Controllers/OfferController";
import multer from "multer";
import fs from "fs";
import { Request, Response } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `./uploads/new`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", offerController.index);
router.post("/upload", upload.array("file", 3), offerController.upload);
router.post("/create", offerController.create);

export default router;
