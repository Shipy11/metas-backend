import { NextFunction, Request, Response } from "express";
import UnauthorizedError from "../errors/UnauthorizedError";
import { verifyToken } from "../lib/jwt";
import prisma from "../lib/prisma";
import { AccountRole } from "@prisma/client";
import ForbiddenError from "../errors/ForbiddenError";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.startsWith("Bearer ")
    ) {
      throw new UnauthorizedError("Missing or invalid authorization header");
    }
    const token = req.headers.authorization.slice(7);
    const decodedToken = verifyToken(token);
    const account = await prisma.account.findUnique({
      where: {
        id: decodedToken.accountId,
      },
      select: {
        name: true,
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
    if (!account || !account.isActive) {
      throw new UnauthorizedError("Account is unauthorized");
    }
    req.account = account;
    return next();
  } catch (e) {
    return next(e);
  }
};

export const authorize = (roles: AccountRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.account) {
        throw new UnauthorizedError("Account is not authenticated");
      }
      const { role } = req.account;
      if (!roles.includes(role)) {
        throw new ForbiddenError("The account is not authorized");
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
};
