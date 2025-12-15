import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { setIo } from "./hub";
import { env } from "../config/env";

const parseTokenFromCookies = (cookieHeader?: string): string | undefined => {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const tokenPair = parts.find((p) => p.startsWith("token="));
  return tokenPair ? tokenPair.replace("token=", "") : undefined;
};

export const registerSocketServer = (httpServer: Parameters<Server["listen"]>[0]): Server => {
  const io = new Server(httpServer, {
    cors: { origin: env.clientOrigin, credentials: true },
  });

  setIo(io);

  io.use((socket, next) => {
    const token =
      (socket.handshake.auth?.token as string | undefined) ||
      parseTokenFromCookies(socket.handshake.headers.cookie);
    if (!token) {
      next(new Error("No token provided"));
      return;
    }
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as { sub: string };
      socket.data.userId = decoded.sub;
      next();
    } catch (err) {
      next(err as Error);
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string | undefined;
    if (userId) {
      socket.join(userId);
    }

    socket.on("disconnect", () => {
      socket.leave(userId ?? "");
    });
  });

  return io;
};

