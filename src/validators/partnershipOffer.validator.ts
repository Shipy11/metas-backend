import { EquityOfferType, PartnershipOfferStatus } from "@prisma/client";
import { z } from "zod";

const partnershipOfferFields = {
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(1000).optional(),

  fundingGoal: z.coerce.number().positive().optional(),
  equityPercentage: z.coerce.number().gt(0).max(100).optional(),
  minimumInvestment: z.coerce.number().positive().optional(),

  purpose: z.string().max(500).optional(),

  offerType: z.enum(EquityOfferType).optional(),

  expiresAt: z.coerce.date().optional(),
};

export const createPartnershipOfferSchema = z
  .object({
    ...partnershipOfferFields,

    title: z.string().min(3).max(100),
    fundingGoal: z.coerce.number().positive(),
    equityPercentage: z.coerce.number().gt(0).max(100),
    offerType: z.enum(EquityOfferType),
  })
  .refine(
    (data) =>
      !data.minimumInvestment || data.minimumInvestment <= data.fundingGoal,
    {
      message: "Minimum investment cannot exceed the funding goal",
      path: ["minimumInvestment"],
    },
  )
  .refine((data) => !data.expiresAt || data.expiresAt.getTime() > Date.now(), {
    message: "Expiry date must be in the future",
    path: ["expiresAt"],
  });

export const changePartnershipOfferStatusSchema = z.object({
  status: z.enum(PartnershipOfferStatus),
});

export const offerIdSchema = z.object({
  offerId: z.coerce.number().int().positive(),
});
