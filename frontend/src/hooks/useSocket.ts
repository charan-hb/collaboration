import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../state/AuthContext";

let socket: Socket | null = null;

export const useSocket = (): void => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      socket?.disconnect();
      socket = null;
      return;
    }

    if (!socket) {
      socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
        withCredentials: true,
      });
    }

    const invalidateTasks = () =>
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

    socket.on("task:created", invalidateTasks);
    socket.on("task:updated", invalidateTasks);
    socket.on("task:deleted", invalidateTasks);
    socket.on("task:assigned", invalidateTasks);

    return () => {
      socket?.off("task:created", invalidateTasks);
      socket?.off("task:updated", invalidateTasks);
      socket?.off("task:deleted", invalidateTasks);
      socket?.off("task:assigned", invalidateTasks);
    };
  }, [user, queryClient]);
};


