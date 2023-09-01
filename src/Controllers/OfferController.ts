import { Request, Response } from "express";
import Offer from "../entities/Offer";
import Category from "../entities/Category";
import datasource from "../db/datasource";
import fs from "fs";

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

  upload: function (req: Request, res: Response) {
    console.log(req.body.title);
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
    newOffer.date = dd + "-" + mm + "-" + yyyy;
    newOffer.author = req.body.author;
    newOffer.country = req.body.country;
    newOffer.phone = req.body.phone;
    try {
      const offerRepository = datasource.getRepository(Offer);
      const savedOffer = await offerRepository.save(newOffer);
      try {
        await fs.rename(
          "./uploads/new",
          `./uploads/${savedOffer.id}`,
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully renamed the directory.");

              const imagesPaths: string[] = [];
              
                fs.readdirSync(`./uploads/${savedOffer.id}/`).forEach((file) => {
                  imagesPaths.push(
                    `http://localhost:8000/uploads/${savedOffer.id}/${file}`
                  );
                });
            
                console.log(imagesPaths);

              try {
                offerRepository
                  .createQueryBuilder()
                  .update(Offer)
                  .set({ images: imagesPaths })
                  .where("id = :id", { id: savedOffer.id })
                  .execute();
              } catch (err) {
                console.log(err);
              }
            }
          }
        );
      } catch (err) {
        console.log(err);
      }

      res.status(201).json({ id: savedOffer.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating the offer" });
    }
  },
};

export default offerController;
