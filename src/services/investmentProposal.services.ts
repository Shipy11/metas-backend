import prisma from "../lib/prisma";
import {
  Prisma,
  InvestmentProposal,
  InvestmentProposalStatus,
  PartnershipOfferStatus,
  CompanyRole,
} from "@prisma/client";
import NotFoundError from "../errors/NotFoundError";
import ForbiddenError from "../errors/ForbiddenError";
import AppError from "../errors/AppError";

export type CreateProposalData = {
  investmentAmount: number;
  requestedEquity: number;
  message?: string;
};

export type UpdateProposalData = Partial<CreateProposalData>;

export const validateProposalContext = async (
  companyId: number,
  offerId: number,
  accountId?: number,
  requireOwner = false,
  preventCompanyMember = false,
) => {
  const [company, offer, membership] = await Promise.all([
    prisma.company.findUnique({
      where: { id: companyId },
    }),

    prisma.partnershipOffer.findUnique({
      where: { id: offerId },
    }),

    accountId
      ? prisma.companyMember.findUnique({
          where: {
            accountId_companyId: {
              accountId,
              companyId,
            },
          },
        })
      : Promise.resolve(null),
  ]);

  if (!company || !company.isActive) {
    throw new NotFoundError("The requested company was not found");
  }

  if (!offer || offer.companyId !== companyId) {
    throw new NotFoundError("The requested partnership offer was not found");
  }

  if (requireOwner) {
    if (
      !membership ||
      !membership.isActive ||
      membership.role !== CompanyRole.OWNER
    ) {
      throw new ForbiddenError("You are not authorized to perform this action");
    }
  }

  if (preventCompanyMember && membership && membership?.isActive) {
    throw new AppError(
      "Company members cannot submit investment proposals",
      400,
    );
  }
  return {
    company,
    offer,
    membership,
  };
};

export const createProposal = async (
  companyId: number,
  offerId: number,
  accountId: number,
  data: CreateProposalData,
) => {
  const { offer } = await validateProposalContext(
    companyId,
    offerId,
    accountId,
    false,
    true,
  );

  if (offer.status !== PartnershipOfferStatus.OPEN) {
    throw new AppError(
      "This partnership offer is not accepting proposals",
      400,
    );
  }

  if (offer.expiresAt && offer.expiresAt < new Date()) {
    throw new AppError("This partnership offer has expired", 400);
  }

  if (
    offer.minimumInvestment &&
    data.investmentAmount < Number(offer.minimumInvestment)
  ) {
    throw new AppError(
      "Investment amount is below the minimum investment",
      400,
    );
  }

  try {
    return await prisma.investmentProposal.create({
      data: {
        ...data,
        companyId,
        offerId,
        createdById: accountId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "You have already submitted a proposal for this offer",
        409,
      );
    }

    throw error;
  }
};

export const updateProposal = async (
  companyId: number,
  offerId: number,
  accountId: number,
  proposalId: number,
  data: UpdateProposalData,
) => {
  const { offer } = await validateProposalContext(companyId, offerId);

  const proposal = await prisma.investmentProposal.findUnique({
    where: {
      id: proposalId,
    },
  });

  if (
    !proposal ||
    proposal.companyId !== companyId ||
    proposal.offerId !== offerId
  ) {
    throw new NotFoundError("The requested proposal was not found");
  }

  if (proposal.createdById !== accountId) {
    throw new ForbiddenError("You are not authorized to update this proposal");
  }

  if (proposal.status !== InvestmentProposalStatus.PENDING) {
    throw new AppError("Only pending proposals can be updated", 400);
  }

  if (offer.expiresAt && offer.expiresAt < new Date()) {
    throw new AppError("This partnership offer has expired", 400);
  }

  const investmentAmount =
    data.investmentAmount ?? Number(proposal.investmentAmount);

  if (
    offer.minimumInvestment &&
    investmentAmount < Number(offer.minimumInvestment)
  ) {
    throw new AppError(
      "Investment amount is below the minimum investment",
      400,
    );
  }

  return prisma.investmentProposal.update({
    where: {
      id: proposalId,
    },
    data,
  });
};

export const updateProposalStatus = async (
  companyId: number,
  offerId: number,
  accountId: number,
  proposalId: number,
  status: InvestmentProposalStatus,
) => {
  const proposal = await prisma.investmentProposal.findUnique({
    where: { id: proposalId },
  });

  if (
    !proposal ||
    proposal.companyId !== companyId ||
    proposal.offerId !== offerId
  ) {
    throw new NotFoundError("The requested proposal was not found");
  }

  if (proposal.status !== InvestmentProposalStatus.PENDING) {
    throw new AppError("This proposal has already been reviewed", 400);
  }

  // Dispatcher: call specific handlers depending on requested status
  if (status === InvestmentProposalStatus.ACCEPTED) {
    await validateProposalContext(companyId, offerId, accountId, true);
    return acceptProposal(proposal, accountId);
  }

  if (status === InvestmentProposalStatus.REJECTED) {
    await validateProposalContext(companyId, offerId, accountId, true);
    return rejectProposal(proposal, accountId);
  }

  if (status === InvestmentProposalStatus.WITHDRAWN) {
    if (proposal.createdById !== accountId) {
      throw new ForbiddenError(
        "You are not authorized to withdraw this proposal",
      );
    }
    return withdrawProposal(proposal);
  }

  // Fallback: disallow unknown status changes
  throw new AppError("Invalid proposal status", 400);
};

const acceptProposal = async (
  proposal: InvestmentProposal,
  accountId: number,
) => {
  return prisma.$transaction(async (tx) => {
    const offer = await tx.partnershipOffer.findUnique({
      where: { id: proposal.offerId },
    });

    if (!offer || offer.companyId !== proposal.companyId) {
      throw new NotFoundError("The requested partnership offer was not found");
    }

    if (
      offer.status !== PartnershipOfferStatus.OPEN &&
      offer.status !== PartnershipOfferStatus.PARTIALLY_FUNDED
    ) {
      throw new AppError(
        "This partnership offer is not accepting proposals",
        400,
      );
    }

    if (offer.expiresAt && offer.expiresAt < new Date()) {
      throw new AppError("This partnership offer has expired", 400);
    }

    const fundingRaised = Number(offer.fundingRaised ?? 0);
    const fundingGoal = Number(offer.fundingGoal ?? 0);
    const investmentAmount = Number(proposal.investmentAmount);

    const equityCommitted = Number(offer.equityCommitted ?? 0);
    const equityPercentage = Number(offer.equityPercentage ?? 0);
    const requestedEquity = Number(proposal.requestedEquity);

    const remainingFunding = fundingGoal - fundingRaised;
    const remainingEquity = equityPercentage - equityCommitted;

    if (
      investmentAmount > remainingFunding ||
      requestedEquity > remainingEquity
    ) {
      throw new AppError(
        "Proposal exceeds the remaining funding or equity.",
        400,
      );
    }

    const updatedProposal = await tx.investmentProposal.update({
      where: { id: proposal.id },
      data: {
        status: InvestmentProposalStatus.ACCEPTED,
        reviewedById: accountId,
        reviewedAt: new Date(),
      },
    });

    const newFundingRaised = fundingRaised + investmentAmount;
    const newEquityCommitted = equityCommitted + requestedEquity;

    const newOfferStatus =
      newFundingRaised >= fundingGoal && newEquityCommitted >= equityPercentage
        ? PartnershipOfferStatus.FUNDED
        : PartnershipOfferStatus.PARTIALLY_FUNDED;

    await tx.partnershipOffer.update({
      where: { id: offer.id },
      data: {
        fundingRaised: newFundingRaised,
        equityCommitted: newEquityCommitted,
        status: newOfferStatus,
      },
    });

    const member = await tx.companyMember.findUnique({
      where: {
        accountId_companyId: {
          accountId: proposal.createdById,
          companyId: proposal.companyId,
        },
      },
    });

    if (member) {
      await tx.companyMember.update({
        where: { id: member.id },
        data: {
          ownershipPercentage:
            Number(member.ownershipPercentage ?? 0) + requestedEquity,
        },
      });
    } else {
      await tx.companyMember.create({
        data: {
          accountId: proposal.createdById,
          companyId: proposal.companyId,
          role: CompanyRole.PARTNER,
          ownershipPercentage: requestedEquity,
          isActive: true,
        },
      });
    }

    return updatedProposal;
  });
};

const rejectProposal = async (
  proposal: InvestmentProposal,
  accountId: number,
) => {
  return prisma.investmentProposal.update({
    where: { id: proposal.id },
    data: {
      status: InvestmentProposalStatus.REJECTED,
      reviewedById: accountId,
      reviewedAt: new Date(),
    },
  });
};

const withdrawProposal = async (proposal: InvestmentProposal) => {
  return prisma.investmentProposal.update({
    where: { id: proposal.id },
    data: {
      status: InvestmentProposalStatus.WITHDRAWN,
      reviewedById: null,
      reviewedAt: null,
    },
  });
};

export const getAllProposal = async (companyId: number, offerId: number) => {
  await validateProposalContext(companyId, offerId);

  return prisma.investmentProposal.findMany({
    where: {
      companyId,
      offerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProposal = async (
  companyId: number,
  offerId: number,
  proposalId: number,
) => {
  const proposal = await prisma.investmentProposal.findUnique({
    where: {
      id: proposalId,
    },
  });

  if (
    !proposal ||
    proposal.companyId !== companyId ||
    proposal.offerId !== offerId
  ) {
    throw new NotFoundError("The requested proposal was not found");
  }

  return proposal;
};
