import { Request, Response, NextFunction } from "express";
import {
  createCompany,
  updateCompany,
  getAllCompany,
  getCompany,
  createCompanyData,
  UpdateCompanyData,
} from "../services/company.services";
import {
  companyIdSchema,
  createCompanySchema,
  updateCompanySchema,
} from "../validators/company.validator";
import UnauthorizedError from "../errors/UnauthorizedError";

export const createCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedCompanyData = createCompanySchema.parse(req.body);
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const createdCompany = await createCompany(
      validatedCompanyData as createCompanyData,
      req.account.id,
    );
    return res.status(201).json({
      status: "success",
      data: createdCompany,
    });
  } catch (e) {
    next(e);
  }
};

export const updateCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedCompanyData = updateCompanySchema.parse(req.body);
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const updatedCompany = await updateCompany(
      validatedCompanyId.companyId,
      req.account.id,
      validatedCompanyData as UpdateCompanyData,
    );
    return res.status(200).json({
      status: "success",
      data: updatedCompany,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    await updateCompany(validatedCompanyId.companyId, req.account.id, {
      isActive: false,
    });
    return res.status(200).json({
      status: "success",
      message: "Company deactivated successfully",
    });
  } catch (e) {
    next(e);
  }
};

export const getAllCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companies = await getAllCompany();

    return res.status(200).json({
      status: "success",
      data: companies,
    });
  } catch (e) {
    next(e);
  }
};

export const getCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const company = await getCompany(validatedCompanyId.companyId);

    return res.status(200).json({
      status: "success",
      data: company,
    });
  } catch (e) {
    next(e);
  }
};
