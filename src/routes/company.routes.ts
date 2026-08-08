import { Router } from "express";
import {
  createCompanyController,
  deleteCompanyController,
  getAllCompanyController,
  getCompanyController,
  updateCompanyController,
} from "../controllers/company.controller";
import {
  createFinancialRecordController,
  updateFinancialRecordController,
} from "../controllers/financial.controller";
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

companyRouter.post(
  "/:companyId/financials",
  authenticate,
  createFinancialRecordController,
);

companyRouter.patch(
  "/:companyId/financials/:financeId",
  authenticate,
  updateFinancialRecordController,
);

export default companyRouter;
