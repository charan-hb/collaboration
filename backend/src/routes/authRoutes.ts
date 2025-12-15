import { Router } from "express";
import { authController } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema, updateProfileSchema } from "../dtos/auth.dto";
import { requireAuth } from "../middleware/auth";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), authController.register);
authRoutes.post("/login", validate(loginSchema), authController.login);
authRoutes.post("/logout", requireAuth, authController.logout);
authRoutes.get("/me", requireAuth, authController.me);
authRoutes.patch("/profile", requireAuth, validate(updateProfileSchema), authController.updateProfile);


