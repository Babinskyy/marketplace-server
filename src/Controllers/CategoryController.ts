import { Request, Response } from "express";
import Category from "../entities/Category";
import datasource from "../db/datasource";

const categoryController = {
  index: async (_req: Request, res: Response) => {
    try {
      const categoriesRepository = datasource.getRepository(Category);
      const categories = await categoriesRepository.find();

      res.json({error: false, categories: categories});
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error fetching data from the database" });
    }
  },
};

export default categoryController;
