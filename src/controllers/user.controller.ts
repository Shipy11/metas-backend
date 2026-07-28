import { Request, Response, NextFunction } from "express";
import { createUser, getAllUsers, loginUser } from "../services/user.services";
import {
  createUserSchema,
  loginUserSchema,
} from "../validators/user.validator";

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const user = await createUser(validatedData);

    return res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedLoginData = loginUserSchema.parse(req.body);
    const { user, accessToken } = await loginUser(validatedLoginData);
    return res.status(200).json({
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (e) {
    next(e);
  }
};
