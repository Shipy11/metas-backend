import { UserType } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        id: number;
        email: string;
        userType: UserType;
      };
    }
  }
}

export {};
