import { Request, Response, NextFunction } from "express";
import {
  createProposalSchema,
  updateProposalSchema,
  updateProposalStatusSchema,
  proposalIdSchema,
} from "../validators/investmentProposal.validator";
import UnauthorizedError from "../errors/UnauthorizedError";
import { companyIdSchema } from "../validators/company.validator";
import { offerIdSchema } from "../validators/partnershipOffer.validator";
import {
  createProposal,
  updateProposal,
  updateProposalStatus,
  getAllProposal,
  getProposal,
} from "../services/investmentProposal.services";

export const createProposalController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedProposalData = createProposalSchema.parse(req.body);
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const validatedOfferId = offerIdSchema.parse({
      offerId: req.params.offerId,
    });
    const createdProposal = await createProposal(
      validatedCompanyId.companyId,
      validatedOfferId.offerId,
      req.account.id,
      validatedProposalData,
    );
    return res.status(201).json({
      status: "success",
      data: createdProposal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProposalController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedProposalData = updateProposalSchema.parse(req.body);
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const validatedOfferId = offerIdSchema.parse({
      offerId: req.params.offerId,
    });
    const validatedProposalId = proposalIdSchema.parse({
      proposalId: req.params.proposalId,
    });
    const updatedProposal = await updateProposal(
      validatedCompanyId.companyId,
      validatedOfferId.offerId,
      req.account.id,
      validatedProposalId.proposalId,
      validatedProposalData,
    );
    return res.status(200).json({
      status: "success",
      data: updatedProposal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProposalStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedStatusData = updateProposalStatusSchema.parse(req.body);
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const validatedOfferId = offerIdSchema.parse({
      offerId: req.params.offerId,
    });
    const validatedProposalId = proposalIdSchema.parse({
      proposalId: req.params.proposalId,
    });
    const updatedProposalStatus = await updateProposalStatus(
      validatedCompanyId.companyId,
      validatedOfferId.offerId,
      req.account.id,
      validatedProposalId.proposalId,
      validatedStatusData.status,
    );
    return res.status(200).json({
      status: "success",
      data: updatedProposalStatus,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProposalsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const validatedOfferId = offerIdSchema.parse({
      offerId: req.params.offerId,
    });
    const allProposals = await getAllProposal(
      validatedCompanyId.companyId,
      validatedOfferId.offerId,
    );
    return res.status(200).json({
      status: "success",
      data: allProposals,
    });
  } catch (error) {
    next(error);
  }
};

export const getProposalController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const validatedOfferId = offerIdSchema.parse({
      offerId: req.params.offerId,
    });
    const validatedProposalId = proposalIdSchema.parse({
      proposalId: req.params.proposalId,
    });
    const proposal = await getProposal(
      validatedCompanyId.companyId,
      validatedOfferId.offerId,
      validatedProposalId.proposalId,
    );
    return res.status(200).json({
      status: "success",
      data: proposal,
    });
  } catch (error) {
    next(error);
  }
};
