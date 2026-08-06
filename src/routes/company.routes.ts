import { Router } from "express";
import {
  createCompanyController,
  deleteCompanyController,
  getAllCompanyController,
  getCompanyController,
  updateCompanyController,
} from "../controllers/company.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const companyRouter = Router();

companyRouter.post("/", authenticate, createCompanyController);

companyRouter.patch("/:companyId", authenticate, updateCompanyController);

companyRouter.delete("/:companyId", authenticate, deleteCompanyController);

companyRouter.get(
  "/all",
  authenticate,
  authorize(["ADMIN"]),
  getAllCompanyController,
);

companyRouter.get("/:companyId", authenticate, getCompanyController);

export default companyRouter;
