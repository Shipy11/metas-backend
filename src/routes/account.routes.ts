import { Router } from "express";
import {
  createAccountController,
  loginAccountController,
  getAllAccountsController,
} from "../controllers/account.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const accountRouter = Router();

accountRouter.post("/signUp", createAccountController);

accountRouter.post("/login", loginAccountController);

accountRouter.get(
  "/accounts",
  authenticate,
  authorize(["ADMIN"]),
  getAllAccountsController,
);

export default accountRouter;
