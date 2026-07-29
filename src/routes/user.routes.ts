import { Router } from "express";
import {
  createUserController,
  loginUserController,
  getAllUsersController,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post("/signUp", createUserController);

userRouter.post("/login", loginUserController);

userRouter.get("/users", authenticate, getAllUsersController);

export default userRouter;
