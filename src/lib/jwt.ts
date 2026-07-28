import jwt, { SignOptions, Secret } from "jsonwebtoken";

export const generateToken = (userId: number) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT Secret Not found");
  }
  const jwtExpiryDuration = process.env.JWT_EXPIRES_IN;
  if (!jwtExpiryDuration) {
    throw new Error("JWT expiry durartion Not found");
  }

  const jwtToken = jwt.sign({ userId }, jwtSecret as Secret, {
    expiresIn: jwtExpiryDuration as SignOptions["expiresIn"],
  });

  return jwtToken;
};
