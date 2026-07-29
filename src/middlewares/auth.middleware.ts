import { NextFunction, Request, Response } from "express";
import UnauthorizedError from "../errors/UnauthorizedError";
import { verifyToken } from "../lib/jwt";
import prisma from "../lib/prisma";
import { UserType } from "@prisma/client";
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
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        name: true,
        id: true,
        email: true,
        userType: true,
      },
    });
    if (!user) {
      throw new UnauthorizedError("User does not exist");
    }
    req.user = user;
    return next();
  } catch (e) {
    return next(e);
  }
};

export const authorize = (roles: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User is not authenticated");
      }
      const { userType } = req.user;
      if (!roles.includes(userType)) {
        throw new ForbiddenError("The user is not authorized");
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
};
