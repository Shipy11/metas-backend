import { Request, Response, NextFunction } from "express";
import { companyIdSchema } from "../validators/company.validator";
import {
  offerIdSchema,
  createPartnershipOfferSchema,
  changePartnershipOfferStatusSchema,
} from "../validators/partnershipOffer.validator";
import {
  createPartnershipOffer,
  changeStatusOfPartnershipOffer,
  getAllPartnershipOffer,
  getPartnershipOffer,
} from "../services/partnershipOffer.services";
import UnauthorizedError from "../errors/UnauthorizedError";
export const createPartnershipOfferController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedOfferData = createPartnershipOfferSchema.parse(req.body);
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const createdOffer = await createPartnershipOffer(
      validatedCompanyId.companyId,
      req.account.id,
      validatedOfferData,
    );
    return res.status(201).json({
      status: "success",
      data: createdOffer,
    });
  } catch (e) {
    next(e);
  }
};
export const changeStatusOfPartnershipOfferController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedOfferData = changePartnershipOfferStatusSchema.parse(
      req.body,
    );
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const validatedOfferId = offerIdSchema.parse({
      offerId: req.params.offerId,
    });
    const updatedOfferData = await changeStatusOfPartnershipOffer(
      validatedCompanyId.companyId,
      validatedOfferId.offerId,
      req.account.id,
      validatedOfferData.status,
    );
    return res.status(200).json({
      status: "success",
      data: updatedOfferData,
    });
  } catch (e) {
    next(e);
  }
};
export const getAllPartnershipOfferController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });

    const offerData = await getAllPartnershipOffer(
      validatedCompanyId.companyId,
    );

    return res.status(200).json({
      status: "success",
      data: offerData,
    });
  } catch (e) {
    next(e);
  }
};
export const getPartnershipOfferController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const validatedOfferId = offerIdSchema.parse({
      offerId: req.params.offerId,
    });
    const offerData = await getPartnershipOffer(
      validatedCompanyId.companyId,
      validatedOfferId.offerId,
    );
    return res.status(200).json({
      status: "success",
      data: offerData,
    });
  } catch (e) {
    next(e);
  }
};
