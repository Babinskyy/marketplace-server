import express from "express";
import offerController from "../Controllers/OfferController";
import multer from "multer";
import fs from "fs";
import authMiddle from "../middlewares/AuthMiddleware";

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
router.get("/findOne/:id", offerController.findOne);
router.get("/user", authMiddle, offerController.user);
router.post(
  "/upload",
  authMiddle,
  upload.array("file", 3),
  offerController.upload
);
router.post("/create", authMiddle, offerController.create);
router.put("/update/:id", authMiddle, offerController.update);
router.delete("/delete/:id", authMiddle, offerController.delete);

export default router;
