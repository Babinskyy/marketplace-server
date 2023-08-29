import { Request, Response } from "express";
import Offers from "../entities/Offers";
import datasource from "../db/datasource";

const offersController = {
    index: async (req: Request, res: Response) => {
        try {
          // const userRepository = datasource.getRepository(Users);
          // const users = await userRepository.find();
      
          const offerRepository = datasource.getRepository(Offers);
          const offers = await offerRepository.find();
      
          res.json(offers);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error fetching data from the database" });
        }
      }
}

export default offersController;
