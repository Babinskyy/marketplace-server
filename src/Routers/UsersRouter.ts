import express from "express";
import usersController from "../Controllers/UsersController";
import authMiddle from "../middlewares/AuthMiddleware";

const router = express.Router();

router.get("/", usersController.index);
router.get("/logged", authMiddle, usersController.loggedCheck);
router.post("/login", usersController.login);
router.post("/signup", usersController.signup);
router.post("/logout", usersController.logout);

export default router;
