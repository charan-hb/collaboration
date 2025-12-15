import { api } from "./client";
import type { User } from "./types";

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/api/users");
  return data.users;
};


