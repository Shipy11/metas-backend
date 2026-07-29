import { NextFunction, Request, Response } from "express";
import UnauthorizedError from "../errors/UnauthorizedError";
import { verifyToken } from "../lib/jwt";
import prisma from "../lib/prisma";

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
      throw new UnauthorizedError("Invalid Token");
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
