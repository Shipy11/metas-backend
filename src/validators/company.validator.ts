import { z } from "zod";

const fields = {
  name: z.string().min(3).max(50).optional(),
  email: z.email().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  gstNumber: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  legalName: z.string().optional(),
  industry: z.string().optional(),
  businessType: z.string().optional(),
  productsOrServices: z.string().optional(),
  foundedYear: z.number().optional(),
  websiteUrl: z.string().optional(),
};

export const updateCompanySchema = z.object(fields);

export const createCompanySchema = z.object({
  ...fields,
  name: z.string().min(3).max(50),
  email: z.email(),
  phoneNumber: z.string(),
});

export const companyIdSchema = z.object({
  companyId: z.coerce.number().int().positive(),
});
