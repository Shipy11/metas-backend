import prisma from "../lib/prisma";
import { AccountRole } from "@prisma/client";
import bcrypt from "bcrypt";
import AppError from "../errors/AppError";
import UnauthorizedError from "../errors/UnauthorizedError";
import { generateToken } from "../lib/jwt";

type CreateAccountData = {
  name: string;
  email: string;
  password: string;
  role: AccountRole;
};

export const createAccount = async (data: CreateAccountData) => {
  const existingAccount = await prisma.account.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existingAccount) {
    throw new AppError("An account with this email already exists", 409);
  }

  const SALT_ROUNDS = 10;

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const account = await prisma.account.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      role: data.role,
    },
  });
  return account;
};

export const loginAccount = async (data: {
  email: string;
  password: string;
}) => {
  const account = await prisma.account.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!account) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const isPasswordMatched = await bcrypt.compare(
    data.password,
    account.passwordHash as string,
  );
  if (!isPasswordMatched) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const accessToken = generateToken(account.id);
  return {
    account: {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    },
    accessToken,
  };
};

export const getAllAccounts = async () => {
  return prisma.account.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,

      companyMemberships: {
        select: {
          id: true,
          role: true,
          isActive: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};
