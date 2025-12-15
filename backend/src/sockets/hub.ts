import { Server } from "socket.io";

let io: Server | null = null;

export const setIo = (server: Server): void => {
  io = server;
};

export const getIo = (): Server | null => io;

export const emitTaskEvent = (
  event: "task:updated" | "task:deleted" | "task:created" | "task:assigned",
  payload: unknown,
  targetUserIds?: string[]
): void => {
  if (!io) return;
  if (targetUserIds && targetUserIds.length) {
    targetUserIds.forEach((userId) => {
      io!.to(userId).emit(event, payload);
    });
    return;
  }
  io.emit(event, payload);
};


