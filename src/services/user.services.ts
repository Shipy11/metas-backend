import prisma from "../lib/prisma";
import { UserType } from "@prisma/client";
import bcrypt from "bcrypt";
import AppError from "../errors/AppError";
import UnauthorizedError from "../errors/UnauthorizedError";
import { generateToken } from "../lib/jwt";

type CreateUserData = {
  name: string;
  email: string;
  password: string;
  userType: UserType;
};

export const createUser = async (data: CreateUserData) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const SALT_ROUNDS = 10;

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      userType: data.userType,
    },
  });
  return user;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const isPasswordMatched = await bcrypt.compare(
    data.password,
    user.password as string,
  );
  if (!isPasswordMatched) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const accessToken = generateToken(user.id);
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    },
    accessToken,
  };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      userType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};
