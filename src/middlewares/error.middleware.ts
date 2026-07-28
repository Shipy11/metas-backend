import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { ZodError } from "zod";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(422).json({
      message: error.issues,
    });
  }
  console.error(error);
  return res.status(500).json({
    message: "Internal Server Error",
  });
};
export default errorHandler;
