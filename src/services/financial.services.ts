import NotFoundError from "../errors/NotFoundError";
import ForbiddenError from "../errors/ForbiddenError";
import AppError from "../errors/AppError";
import prisma from "../lib/prisma";

export type FinancialRecordData = {
  periodStart: Date;
  periodEnd: Date;
  revenue: number;
  expenses: number;
  companyValuation?: number;
  totalDebt?: number;
  totalAssets?: number;
  cashBalance?: number;
};

const checkCompanyAccess = async (companyId: number, accountId: number) => {
  const membership = await prisma.companyMember.findUnique({
    where: {
      accountId_companyId: {
        accountId,
        companyId,
      },
    },
  });

  if (!membership || !membership.isActive) {
    throw new ForbiddenError(
      "You are not authorized to modify this company's financial records",
    );
  }

  return membership;
};

export const createFinancialRecord = async (
  companyId: number,
  accountId: number,
  data: FinancialRecordData,
) => {
  const [existingCompany] = await Promise.all([
    prisma.company.findUnique({
      where: { id: companyId },
    }),
    checkCompanyAccess(companyId, accountId),
  ]);

  if (!existingCompany) {
    throw new NotFoundError("Company not found");
  }

  return prisma.financialRecord.create({
    data: {
      ...data,
      companyId,
      createdById: accountId,
    },
  });
};

export const updateFinancialRecord = async (
  companyId: number,
  financeId: number,
  accountId: number,
  data: Partial<FinancialRecordData>,
) => {
  const [existingCompany, existingFinancialRecord] = await Promise.all([
    prisma.company.findUnique({
      where: { id: companyId },
    }),

    prisma.financialRecord.findUnique({
      where: { id: financeId },
    }),

    checkCompanyAccess(companyId, accountId),
  ]);

  if (!existingCompany) {
    throw new NotFoundError("Company not found");
  }

  if (
    !existingFinancialRecord ||
    existingFinancialRecord.companyId !== companyId
  ) {
    throw new NotFoundError("Financial record not found for this company");
  }
  const periodStart = data.periodStart ?? existingFinancialRecord.periodStart;
  const periodEnd = data.periodEnd ?? existingFinancialRecord.periodEnd;

  if (periodStart >= periodEnd) {
    throw new AppError("Period end must be after period start", 400);
  }

  return prisma.financialRecord.update({
    where: {
      id: financeId,
    },
    data: {
      ...data,
      lastUpdatedById: accountId,
    },
  });
};
