import { z } from "zod";
import { AccountRole } from "@prisma/client";

export const createAccountSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(AccountRole),
});

export const loginAccountSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
