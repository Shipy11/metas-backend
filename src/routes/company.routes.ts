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

import {
  createProposalController,
  updateProposalController,
  updateProposalStatusController,
  getAllProposalsController,
  getProposalController,
} from "../controllers/investmentProposal.controller";

const companyRouter = Router();

// Company
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

// Financials
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

// Partnership Offers
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

// Investment Proposals
companyRouter.post(
  "/:companyId/offers/:offerId/proposals",
  authenticate,
  createProposalController,
);

companyRouter.get(
  "/:companyId/offers/:offerId/proposals",
  authenticate,
  getAllProposalsController,
);

companyRouter.get(
  "/:companyId/offers/:offerId/proposals/:proposalId",
  authenticate,
  getProposalController,
);

companyRouter.patch(
  "/:companyId/offers/:offerId/proposals/:proposalId",
  authenticate,
  updateProposalController,
);

companyRouter.patch(
  "/:companyId/offers/:offerId/proposals/:proposalId/status",
  authenticate,
  updateProposalStatusController,
);

export default companyRouter;
