import express from "express";
import usersController from "../Controllers/UsersController";

const router = express.Router();

router.get("/", usersController.index);
router.post("/login", usersController.login);
router.post("/signup", usersController.signup);
router.post("/logout", usersController.logout);

export default router;
