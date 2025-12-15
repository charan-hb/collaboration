import { api } from "./client";
import type { Filters, Task } from "./types";

/**
 * Fetch all tasks with optional filters
 */
export const fetchTasks = async (
  filters?: Filters
): Promise<Task[]> => {
  const params = filters
    ? {
        status: filters.status,
        priority: filters.priority,
        dueOrder: filters.dueOrder ?? "asc",
        assignedToMe: filters.assignedToMe ? true : undefined,
        createdByMe: filters.createdByMe ? true : undefined,
        overdue: filters.overdue ? true : undefined,
      }
    : undefined;

  const { data } = await api.get<{ tasks: Task[] }>("/api/tasks", {
    params,
  });

  return data.tasks;
};

/**
 * Create a new task
 */
export const createTask = async (
  input: Omit<
    Task,
    | "id"
    | "creatorId"
    | "createdAt"
    | "updatedAt"
    | "creator"
    | "assignee"
  >
): Promise<Task> => {
  const { data } = await api.post<{ task: Task }>("/api/tasks", input);
  return data.task;
};

/**
 * Update existing task
 */
export const updateTask = async (
  id: string,
  input: Partial<
    Omit<
      Task,
      | "id"
      | "creatorId"
      | "createdAt"
      | "updatedAt"
      | "creator"
      | "assignee"
    >
  >
): Promise<Task> => {
  const { data } = await api.put<{ task: Task }>(
    `/api/tasks/${id}`,
    input
  );
  return data.task;
};

/**
 * Delete a task
 */
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/api/tasks/${id}`);
};
