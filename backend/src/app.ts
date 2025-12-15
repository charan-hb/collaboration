import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env";
import { authRoutes } from "./routes/authRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { userRoutes } from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { requireAuth } from "./middleware/auth";

export const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", requireAuth, taskRoutes);
app.use("/api/users", requireAuth, userRoutes);

app.use(errorHandler);

