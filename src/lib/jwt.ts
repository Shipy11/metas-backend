import jwt, { SignOptions, Secret } from "jsonwebtoken";

interface TokenPayload {
  userId: number;
}

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

export const verifyToken = (token: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT Secret Not found");
  }
  const decodedToken = jwt.verify(token, jwtSecret) as TokenPayload;
  return decodedToken;
};
