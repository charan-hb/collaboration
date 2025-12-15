import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: "Unexpected error" });
};


