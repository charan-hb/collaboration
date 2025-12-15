import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

const signOptions: SignOptions = {
  expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
};

export const signToken = (userId: string): string =>
  jwt.sign({ sub: userId }, env.jwtSecret, signOptions);


