import express from "express";
import offerController from "../controllers/OfferController";
import multer from "multer";
import fs from "fs";


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const path = `./uploads/new`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", offerController.index);
router.get("/user", offerController.user);
router.post("/upload", upload.array("file", 3), offerController.upload);
router.post("/create", offerController.create);
router.put("/update/:id", offerController.update);
router.delete("/delete/:id", offerController.delete);

export default router;
