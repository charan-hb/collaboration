import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  sub: string;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
      req.userId = decoded.sub;
      next();
    } catch {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };


