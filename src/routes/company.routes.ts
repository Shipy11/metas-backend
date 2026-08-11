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
import {
  changeStatusOfPartnershipOfferController,
  createPartnershipOfferController,
  getAllPartnershipOfferController,
  getPartnershipOfferController,
} from "../controllers/partnershipOffer.controller";

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

companyRouter.post(
  "/:companyId/offers",
  authenticate,
  createPartnershipOfferController,
);
companyRouter.patch(
  "/:companyId/offers/:offerId/status",
  authenticate,
  changeStatusOfPartnershipOfferController,
);
companyRouter.get(
  "/:companyId/offers",
  authenticate,
  getAllPartnershipOfferController,
);
companyRouter.get(
  "/:companyId/offers/:offerId",
  authenticate,
  getPartnershipOfferController,
);

export default companyRouter;
