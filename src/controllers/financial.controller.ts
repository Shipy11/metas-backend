import { Request, Response, NextFunction } from "express";
import {
  createFinancialRecord,
  FinancialRecordData,
  updateFinancialRecord,
} from "../services/financial.services";
import {
  createFinancialRecordSchema,
  updateFinancialRecordSchema,
  financeIdSchema,
} from "../validators/financial.validator";
import UnauthorizedError from "../errors/UnauthorizedError";
import { companyIdSchema } from "../validators/company.validator";

export const createFinancialRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedFinanceData = createFinancialRecordSchema.parse(req.body);
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const createdFinancialRecord = await createFinancialRecord(
      validatedCompanyId.companyId,
      req.account.id,
      validatedFinanceData as FinancialRecordData,
    );
    return res.status(201).json({
      status: "success",
      data: createdFinancialRecord,
    });
  } catch (e) {
    next(e);
  }
};

export const updateFinancialRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedCompanyData = updateFinancialRecordSchema.parse(req.body);
    if (!req.account) {
      throw new UnauthorizedError("Account is not authenticated");
    }
    const validatedCompanyId = companyIdSchema.parse({
      companyId: req.params.companyId,
    });
    const validatedFinanceId = financeIdSchema.parse({
      financeId: req.params.financeId,
    });
    const updatedFinancialRecord = await updateFinancialRecord(
      validatedCompanyId.companyId,
      validatedFinanceId.financeId,
      req.account.id,
      validatedCompanyData as Partial<FinancialRecordData>,
    );
    return res.status(200).json({
      status: "success",
      data: updatedFinancialRecord,
    });
  } catch (e) {
    next(e);
  }
};
