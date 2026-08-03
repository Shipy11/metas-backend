import { Request, Response, NextFunction } from "express";
import {
  createAccount,
  loginAccount,
  getAllAccounts,
} from "../services/account.services";
import {
  createAccountSchema,
  loginAccountSchema,
} from "../validators/account.validator";

export const createAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createAccountSchema.parse(req.body);

    const account = await createAccount(validatedData);

    return res.status(201).json({
      message: "account created",
      account: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedLoginData = loginAccountSchema.parse(req.body);
    const { account, accessToken } = await loginAccount(validatedLoginData);
    return res.status(200).json({
      account,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAccountsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accounts = await getAllAccounts();
    return res.status(200).json({
      status: "success",
      data: accounts,
    });
  } catch (e) {
    next(e);
  }
};
