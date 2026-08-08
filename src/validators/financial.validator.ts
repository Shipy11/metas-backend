import { z } from "zod";

const financialRecordFields = {
  periodStart: z.coerce.date().optional(),
  periodEnd: z.coerce.date().optional(),
  revenue: z.coerce.number().nonnegative().optional(),
  expenses: z.coerce.number().nonnegative().optional(),
  companyValuation: z.coerce.number().nonnegative().optional(),
  totalDebt: z.coerce.number().nonnegative().optional(),
  totalAssets: z.coerce.number().nonnegative().optional(),
  cashBalance: z.coerce.number().nonnegative().optional(),
};

export const financialRecordPayloadSchema = z
  .object({
    ...financialRecordFields,

    // Required during creation
    periodStart: z.coerce.date(),
    periodEnd: z.coerce.date(),
    revenue: z.coerce.number().nonnegative(),
    expenses: z.coerce.number().nonnegative(),
  })
  .refine((data) => data.periodStart < data.periodEnd, {
    message: "Period end must be after period start",
    path: ["periodEnd"],
  });

export const createFinancialRecordSchema = financialRecordPayloadSchema;

export const updateFinancialRecordSchema = z
  .object(financialRecordFields)
  .refine(
    (data) =>
      !data.periodStart || !data.periodEnd || data.periodStart < data.periodEnd,
    {
      message: "Period end must be after period start",
      path: ["periodEnd"],
    },
  );

export const financeIdSchema = z.object({
  financeId: z.coerce.number().int().positive(),
});
