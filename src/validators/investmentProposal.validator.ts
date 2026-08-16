import { InvestmentProposalStatus } from "@prisma/client";
import { z } from "zod";

const proposalFields = {
  investmentAmount: z.coerce.number().positive().optional(),
  requestedEquity: z.coerce.number().gt(0).max(100).optional(),
  message: z.string().max(1000).optional(),
};

export const createProposalSchema = z.object({
  ...proposalFields,

  investmentAmount: z.coerce.number().positive(),
  requestedEquity: z.coerce.number().gt(0).max(100),
});

export const updateProposalSchema = z.object(proposalFields);

export const updateProposalStatusSchema = z.object({
  status: z.enum([
    InvestmentProposalStatus.ACCEPTED,
    InvestmentProposalStatus.REJECTED,
    InvestmentProposalStatus.WITHDRAWN,
  ]),
});

export const proposalIdSchema = z.object({
  proposalId: z.coerce.number().int().positive(),
});
