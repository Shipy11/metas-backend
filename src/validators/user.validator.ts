import { z } from "zod";
import { UserType } from "@prisma/client";

export const createUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.email(),
  password: z.string().min(8),
  userType: z.enum(UserType),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
