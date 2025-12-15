import { Status, Priority } from "@prisma/client";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  dueDate: z.string().datetime(),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(Status),
  assigneeId: z.string().uuid().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.nativeEnum(Status).optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;


