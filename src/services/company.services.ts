import prisma from "../lib/prisma";
import AppError from "../errors/AppError";
import NotFoundError from "../errors/NotFoundError";

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
};

// Type for update: allow any subset of updatable fields.
// Exclude `createdById` from updates.
export type UpdateCompanyData = Partial<createCompanyData> & {
  isActive?: boolean;
};

export const createCompany = async (
  data: createCompanyData,
  createdById: number,
) => {
  const existingCompany = await prisma.company.findFirst({
    where: {
      OR: [
        { email: data.email },
        { phoneNumber: data.phoneNumber },
        ...(data.gstNumber ? [{ gstNumber: data.gstNumber }] : []),
      ],
    },
  });

  if (existingCompany) {
    if (existingCompany.email === data.email) {
      throw new AppError("Company with this email already exists", 409);
    }

    if (existingCompany.phoneNumber === data.phoneNumber) {
      throw new AppError("Company with this phone number already exists", 409);
    }

    if (data.gstNumber && existingCompany.gstNumber === data.gstNumber) {
      throw new AppError("Company with this GST number already exists", 409);
    }
  }

  return prisma.company.create({
    data: {
      ...data,
      createdById,

      members: {
        create: {
          accountId: createdById,
          role: "OWNER",
        },
      },
    },
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
    throw new NotFoundError("The Requested compamy is not found");
  }
  return await prisma.company.update({
    where: { id: companyId },
    data: { ...data, lastUpdatedById: updatedById },
  });
};

export const getAllCompany = async () => {
  return await prisma.company.findMany();
};

export const getCompany = async (companyId: number) => {
  return await prisma.company.findUnique({
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
    },
  });
};
