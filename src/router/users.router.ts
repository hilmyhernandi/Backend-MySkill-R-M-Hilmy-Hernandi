import express from "express";
import usersController from "../controllers/users.controller";
import { jwtMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/create", jwtMiddleware, usersController.create);
router.patch("/me", jwtMiddleware, usersController.updateUserProfile);
router.delete("/me", jwtMiddleware, usersController.deleteUser);

export default router;
