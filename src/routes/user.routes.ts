import { Router } from "express";
import {
  createUserController,
  loginUserController,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/signUp", createUserController);

userRouter.post("/login", loginUserController);

export default userRouter;
