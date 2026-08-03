import { AccountRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      account?: {
        name: string;
        id: number;
        email: string;
        role: AccountRole;
        isActive: boolean;
      };
    }
  }
}

export {};
