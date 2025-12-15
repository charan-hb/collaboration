import { Request, Response } from "express";
import { prisma } from "../prisma";

export const userController = {
  list: async (_req: Request, res: Response): Promise<void> => {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
    res.json({ users });
  },
};


