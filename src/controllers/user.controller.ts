import { Request, Response } from "express";
import { createUser, loginUser } from "../services/user.services";
import { Prisma } from "@prisma/client";

export const createUserController = async (req: Request, res: Response) => {
  try {
    if (
      !req.body ||
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.userType
    ) {
      return res.status(400).json({ error: "Missing fields error" });
    }

    const user = await createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType,
    });

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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json({ error: "email already exists" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).send("email and password are required");
    }
    const user = await loginUser({
      email: req.body.email,
      password: req.body.password,
    });
    if (user) {
      return res.status(200).send("User Authenticated");
    } else {
      return res.status(401).send("Wrong Password");
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "User Not Found") {
      return res.status(404).json({ error: e.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};
