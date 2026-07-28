import { Router } from "express";
import {
  createUserController,
  loginUserController,
  getAllUsersController,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/signUp", createUserController);

userRouter.post("/login", loginUserController);

userRouter.get("/users", getAllUsersController);

export default userRouter;
