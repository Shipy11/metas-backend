import prisma from "../lib/prisma";
import { PartnershipOfferStatus, EquityOfferType } from "@prisma/client";
import NotFoundError from "../errors/NotFoundError";
import ForbiddenError from "../errors/ForbiddenError";

export type CreatePartnershipOfferData = {
  title: string;
  description?: string;

  fundingGoal: number;
  equityPercentage: number;
  minimumInvestment?: number;

  purpose?: string;

  offerType: EquityOfferType;

  expiresAt?: Date;
};

const validateCompanyOwnership = async (
  companyId: number,
  accountId: number,
) => {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      members: {
        where: {
          accountId,
        },
      },
    },
  });

  if (!company || !company.isActive) {
    throw new NotFoundError("The requested company was not found");
  }

  const membership = company.members[0];

  if (!membership || !membership.isActive || membership.role !== "OWNER") {
    throw new ForbiddenError(
      "You are not authorized to perform this action for this company",
    );
  }

  return company;
};

export const createPartnershipOffer = async (
  companyId: number,
  accountId: number,
  data: CreatePartnershipOfferData,
) => {
  await validateCompanyOwnership(companyId, accountId);

  return prisma.partnershipOffer.create({
    data: {
      ...data,
      companyId,
      createdById: accountId,
    },
  });
};

export const changeStatusOfPartnershipOffer = async (
  companyId: number,
  offerId: number,
  accountId: number,
  newStatus: PartnershipOfferStatus,
) => {
  await validateCompanyOwnership(companyId, accountId);

  const offer = await prisma.partnershipOffer.findUnique({
    where: {
      id: offerId,
    },
  });

  if (!offer || offer.companyId !== companyId) {
    throw new NotFoundError("The requested partnership offer was not found");
  }

  return prisma.partnershipOffer.update({
    where: {
      id: offerId,
    },
    data: {
      status: newStatus,
      lastUpdatedById: accountId,
    },
  });
};

export const getPartnershipOffer = async (
  companyId: number,
  offerId: number,
) => {
  const offer = await prisma.partnershipOffer.findUnique({
    where: {
      id: offerId,
    },
  });

  if (!offer || offer.companyId !== companyId) {
    throw new NotFoundError("The requested partnership offer was not found");
  }

  return offer;
};

export const getAllPartnershipOffer = async (companyId: number) => {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company) {
    throw new NotFoundError("The requested company was not found");
  }

  return prisma.partnershipOffer.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
