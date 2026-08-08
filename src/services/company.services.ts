import prisma from "../lib/prisma";
import AppError from "../errors/AppError";
import NotFoundError from "../errors/NotFoundError";
import { FinancialRecordData } from "./financial.services";

export type createCompanyData = {
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  gstNumber?: string;
  description?: string;
  logoUrl?: string;
  legalName?: string;
  industry?: string;
  businessType?: string;
  productsOrServices?: string;
  foundedYear?: number;
  websiteUrl?: string;
  financials: FinancialRecordData;
};

// Type for update: allow any subset of updatable fields.
// Exclude `createdById` from updates.
export type UpdateCompanyData = Partial<
  Omit<createCompanyData, "financials">
> & {
  isActive?: boolean;
};

export const createCompany = async (
  data: createCompanyData,
  createdById: number,
) => {
  const { financials, ...companyData } = data;

  const existingCompany = await prisma.company.findFirst({
    where: {
      OR: [
        { email: companyData.email },
        { phoneNumber: companyData.phoneNumber },
        ...(companyData.gstNumber
          ? [{ gstNumber: companyData.gstNumber }]
          : []),
      ],
    },
  });

  if (existingCompany) {
    if (existingCompany.email === companyData.email) {
      throw new AppError("Company with this email already exists", 409);
    }

    if (existingCompany.phoneNumber === companyData.phoneNumber) {
      throw new AppError("Company with this phone number already exists", 409);
    }

    if (
      companyData.gstNumber &&
      existingCompany.gstNumber === companyData.gstNumber
    ) {
      throw new AppError("Company with this GST number already exists", 409);
    }
  }

  console.log("Starting transaction...");

  return prisma.$transaction(async (tx) => {
    console.log("Creating company...");

    const createdCompany = await tx.company.create({
      data: {
        ...companyData,
        createdById,
        members: {
          create: {
            accountId: createdById,
            role: "OWNER",
          },
        },
      },
    });

    console.log("Company created successfully");
    console.log("Company ID:", createdCompany.id);

    console.log("Financial payload:", financials);

    console.log("Creating financial record...");

    const createdFinancialRecord = await tx.financialRecord.create({
      data: {
        ...financials,
        companyId: createdCompany.id,
        createdById,
      },
    });

    console.log("Financial record created successfully");
    console.log("Financial Record ID:", createdFinancialRecord.id);

    console.log("Transaction completed");

    return { createdCompany, createdFinancialRecord };
  });
};

export const updateCompany = async (
  companyId: number,
  updatedById: number,
  data: UpdateCompanyData,
) => {
  const existingCompany = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });
  if (!existingCompany) {
    throw new NotFoundError("The requested company was not found");
  }
  return await prisma.company.update({
    where: { id: companyId },
    data: { ...data, lastUpdatedById: updatedById },
  });
};

export const getAllCompany = async () => {
  return prisma.company.findMany({
    include: {
      financialRecords: {
        orderBy: {
          periodEnd: "desc",
        },
        take: 1,
      },
    },
  });
};

export const getCompany = async (companyId: number) => {
  return prisma.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      members: {
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },

      financialRecords: {
        orderBy: {
          periodEnd: "desc",
        },
      },
    },
  });
};
