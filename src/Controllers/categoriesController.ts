import { Request, Response } from "express";
import Categories from "../entities/Categories";
import datasource from "../db/datasource";

const categoryController = {
    index: async (req: Request, res: Response) => {
        try {
          // const userRepository = datasource.getRepository(Users);
          // const users = await userRepository.find();
      
          const categoriesRepository = datasource.getRepository(Categories);
          const categories = await categoriesRepository.find();
      
          // const offerRepository = datasource.getRepository(Offers);
          // const offers = await offerRepository.find();
      
          res.json(categories);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error fetching data from the database" });
        }
      }
}

export default categoryController;
