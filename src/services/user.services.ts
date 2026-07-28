import prisma from "../lib/prisma";
import { UserType } from "@prisma/client";
import bcrypt from "bcrypt";

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
    throw new Error("User already exists");
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
    throw new Error("User Not Found");
  }
  const isPasswordMatched = await bcrypt.compare(
    data.password,
    user?.password as string,
  );
  return isPasswordMatched;
};
