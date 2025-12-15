import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://ctm_user:ctm_pass@localhost:5432/ctm_db?schema=public",
  // In development, the Vite dev server commonly runs on 5173 or 5174.
  // Default to 5174 to match the current frontend URL, but allow override via CLIENT_ORIGIN.
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5174",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

