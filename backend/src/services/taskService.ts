import { Status, Priority, Task } from "@prisma/client";
import { taskRepository } from "../repositories/taskRepository";
import { userRepository } from "../repositories/userRepository";
import { emitTaskEvent } from "../sockets/hub";

type TaskFilters = {
  status?: Status;
  priority?: Priority;
  dueOrder?: "asc" | "desc";
  assigneeId?: string;
  creatorId?: string;
  overdue?: boolean;
};

export const taskService = {
  list: (filters: TaskFilters) => taskRepository.list(filters),

  create: async (
    data: {
      title: string;
      description: string;
      dueDate: Date;
      priority: Priority;
      status: Status;
      assigneeId?: string;
    },
    creatorId: string
  ): Promise<Task> => {
    if (data.assigneeId) {
      const assignee = await userRepository.findById(data.assigneeId);
      if (!assignee) {
        throw new Error("Assignee not found");
      }
    }
    const task = await taskRepository.create({ ...data, creatorId });
    emitTaskEvent("task:created", task);
    if (task.assigneeId) {
      emitTaskEvent("task:assigned", task, [task.assigneeId]);
    }
    return task;
  },

  update: async (
    id: string,
    data: Partial<Task>,
    actorId: string
  ): Promise<Task> => {
    const existing = await taskRepository.findById(id);
    if (!existing) throw new Error("Task not found");
    if (existing.creatorId !== actorId && existing.assigneeId !== actorId) {
      throw new Error("Forbidden");
    }
    if (data.assigneeId) {
      const assignee = await userRepository.findById(data.assigneeId);
      if (!assignee) throw new Error("Assignee not found");
    }
    const task = await taskRepository.update(id, data);
    emitTaskEvent("task:updated", task);
    if (task.assigneeId) {
      emitTaskEvent("task:assigned", task, [task.assigneeId]);
    }
    return task;
  },

  remove: async (id: string, actorId: string) => {
    const existing = await taskRepository.findById(id);
    if (!existing) throw new Error("Task not found");
    if (existing.creatorId !== actorId) throw new Error("Forbidden");
    await taskRepository.delete(id);
    emitTaskEvent("task:deleted", { id });
  },
};


