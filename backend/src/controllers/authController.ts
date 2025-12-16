import { Request, Response } from "express";
import { authService } from "../services/authService";

const toSafeUser = (user: { id: string; email: string; name: string; createdAt?: Date; updatedAt?: Date }) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const setAuthCookie = (res: Response, token: string): void => {
  // Use secure cookies in production (HTTPS), allow insecure in local dev
  const isProduction = process.env.CLIENT_ORIGIN?.startsWith("https://") ?? false;
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;
      const { user, token } = await authService.register(email, password, name);
      setAuthCookie(res, token);
      res.status(201).json({ user: toSafeUser(user) });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      setAuthCookie(res, token);
      res.json({ user: toSafeUser(user) });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  },

  logout: async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie("token");
    res.status(204).send();
  },

  me: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await authService.profile(req.userId as string);
      res.json({ user: toSafeUser(user) });
    } catch (err) {
      res.status(404).json({ message: (err as Error).message });
    }
  },

  updateProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await authService.updateProfile(
        req.userId as string,
        req.body.name
      );
      res.json({ user: toSafeUser(user) });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  },
};

