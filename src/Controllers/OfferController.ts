import { Request, Response } from "express";
import Offer from "../entities/Offer";
import datasource from "../db/datasource";
import { promises as fsPromises } from "fs";
import Users from "../entities/Users";
import { uploadImageToAzure } from "./UploadToAzure";
import getAzureImages from "./GetAzureImages";

const offerController = {
  index: async (_req: Request, res: Response) => {
    try {
      const offerRepository = datasource.getRepository(Offer);
      const offers = await offerRepository.find({
        relations: ["category"],
      });
      const userRepository = datasource.getRepository(Users);
      const user = await userRepository.findOne({
        where: {
          id: res.locals.userId,
        },
      });

      res.json({
        offers: offers,
        userId: res.locals.userId,
        username: user?.username,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error fetching data from the database" });
    }
  },

  user: async (_req: Request, res: Response) => {
    const userId = res.locals.userId;

    try {
      const offerRepository = datasource.getRepository(Offer);
      const userOffers = await offerRepository
        .createQueryBuilder("offer")
        .where("offer.user = :userId", { userId })
        .leftJoinAndSelect("offer.category", "category")
        .getMany();

      res.json({ offers: userOffers, user: res.locals.userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Error fetching data from the database",
      });
    }
  },

  upload: async (req: Request, res: Response) => {
    try {
      const offerRepository = datasource.getRepository(Offer);
      const getId = await offerRepository.query(
        "SELECT nextval('offer_id_seq')"
      );
      const nextId = Number(getId[0].nextval) + 1;
      try {
        const files = req.files as Express.Multer.File[];

        for (const file of files) {
          const blobName = `${nextId}/${file.originalname}`;
          await uploadImageToAzure(blobName, file.path);
        }
        console.log("Images uploaded to Azure Blob Storage");
        res
          .status(200)
          .json({ message: "Images uploaded to Azure Blob Storage" });
      } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } catch (err) {
      console.error(err);
    }
  },

  create: async (req: Request, res: Response) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const usersRepository = datasource.getRepository(Users);
    const author = await usersRepository.findBy({
      id: res.locals.userId,
    });

    const newOffer = new Offer();
    newOffer.title = req.body.title;
    newOffer.images = [];
    newOffer.description = req.body.description;
    newOffer.price = req.body.price;
    newOffer.date = dd + "-" + mm + "-" + yyyy;
    newOffer.author = author[0].username;
    newOffer.country = req.body.country;
    newOffer.phone = req.body.phone;
    newOffer.category = req.body.category;
    newOffer.user = author[0];

    try {
      const offerRepository = datasource.getRepository(Offer);
      const savedOffer = await offerRepository.save(newOffer);
      try {

        const imagesPaths: string[] = [];

        const pushAzureData = async () => {
          try {
            const urls = await getAzureImages(savedOffer.id.toString()) as string[];
            console.log("Image URLs:", urls);
            
            for (const url of urls) {
              const path = url.split("?")
              imagesPaths.push(`${path[0]}?sp=r&st=2023-09-15T12:13:46Z&se=2023-10-01T20:13:46Z&sv=2022-11-02&sr=c&sig=9e%2FQAnJpGdg1NjUmf4ZiZPC89pcZl0ihi1f6jnJCQmc%3D`);
            }
          } catch (error) {
            console.error("Error retrieving image URLs:", error);
          }
        };
        await pushAzureData();

        try {
          offerRepository
            .createQueryBuilder()
            .update(Offer)
            .set({ images: imagesPaths })
            .where("id = :id", { id: savedOffer.id })
            .execute();
        } catch (err) {
          console.log(err);
          res
            .status(500)
            .json({ error: true, message: "Error creating the offer" });
        }

      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: true, message: "Error creating the offer" });
      }

      res.status(201).json({ id: savedOffer.id, username: author[0].username });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: true, message: "Error creating the offer" });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      await datasource
        .getRepository(Offer)
        .createQueryBuilder("offers")
        .update(Offer)
        .set({
          title: req.body.title1,
          price: req.body.price,
          description: req.body.description,
        })
        .where("id = :id", { id: req.params.id })
        .execute();
      res
        .status(200)
        .json({ error: false, message: `Offer ${req.params.id} updated.` });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: true, message: `Error while updating.` });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await datasource
        .getRepository(Offer)
        .createQueryBuilder("offers")
        .delete()
        .from(Offer)
        .where("id = :id", { id: req.params.id })
        .execute();
      try {
        await fsPromises.rm(`./uploads/${req.params.id}`, {
          recursive: true,
          force: true,
        });
        console.log(`Successfully deleted directory /uploads/${req.params.id}`);
      } catch (error) {
        console.error(
          `Error while deleting '/uploads/${req.params.id}':`,
          error
        );
      }

      res
        .status(200)
        .json({ error: false, message: `Offer ${req.params.id} deleted.` });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: true, message: `Error while deleting.` });
    }
  },
};

export default offerController;
