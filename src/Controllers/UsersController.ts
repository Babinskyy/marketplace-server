import { Request, Response } from "express";
import Users from "../entities/Users";
import datasource from "../db/datasource";
import bcrypt from "bcryptjs";
import passport from "passport";

const usersController = {
  index: async (req: Request, res: Response) => {
    try {
      const usersRepository = datasource.getRepository(Users);
      const users = await usersRepository.find();

      res.json(users);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error fetching users from the database" });
    }
  },
  login: async (req: Request, res: Response, next: any) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) throw err;
      if (!user) res.status(200).json("User not exist");
      else {
        req.login(user, (err) => {
          if (err) throw err;
          res.status(200).json("success");
          console.log(req.user);
        });
      }
    })(req, res, next);
  },
  signup: async (req: Request, res: Response) => {
    try {
      const findUser = await datasource.getRepository(Users).findBy({
        username: req.body.username,
      });

      if (findUser.length) {
        res.status(200).json("Username already exists.");
      } else {
        const newUser = new Users();
        newUser.username = req.body.username;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        newUser.password = hashedPassword;
        const usersRepository = await datasource.getRepository(Users);
        await usersRepository.save(newUser);
        res.status(200).json(`User ${req.body.username} created.`);
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error fetching users from the database" });
    }
  },
};

export default usersController;
