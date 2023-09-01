import { Request, Response } from "express";
import Offer from "../entities/Offer";
import Category from "../entities/Category";
import datasource from "../db/datasource";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    const path = `./uploads/${"dir-" + file.originalname}`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const offerController = {
  index: async (req: Request, res: Response) => {
    try {
      const offerRepository = datasource.getRepository(Offer);
      const offers = await offerRepository.find({
        relations: ["category"],
      });

      res.json(offers);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error fetching data from the database" });
    }
  },
  upload: upload.single("file"),
  function(req: Request, res: Response) {
    res.status(200).json();
  },
  create: async (req: Request, res: Response) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
  
    const newOffer = new Offer();
    newOffer.title = req.body.title;
    newOffer.images = [];
    newOffer.description = req.body.description;
    newOffer.price = req.body.price;
    newOffer.date =  dd + "-" + mm + "-" + yyyy;
    newOffer.author = req.body.author;
    newOffer.country = req.body.country;
    newOffer.phone = req.body.phone;

    console.log(newOffer);
    const offerRepository = datasource.getRepository(Offer);
    offerRepository.save(newOffer)
    // console.log(req.body);
    res.status(200).json(req.body);
  },
};

export default offerController;
