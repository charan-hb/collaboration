import { Status, Priority } from "@prisma/client";
import { prisma } from "../prisma";

type Filters = {
  status?: Status;
  priority?: Priority;
  dueOrder?: "asc" | "desc";
  assigneeId?: string;
  creatorId?: string;
  overdue?: boolean;
};

export const taskRepository = {
  create: (data: {
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    status: Status;
    creatorId: string;
    assigneeId?: string | null;
  }) => prisma.task.create({ data }),

  update: (id: string, data: Partial<Parameters<typeof prisma.task.update>[0]["data"]>) =>
    prisma.task.update({ where: { id }, data }),

  delete: (id: string) => prisma.task.delete({ where: { id } }),

  findById: (id: string) =>
    prisma.task.findUnique({
      where: { id },
      include: {
        creator: true,
        assignee: true,
      },
    }),

  list: (filters: Filters) =>
    prisma.task.findMany({
      where: {
        status: filters.status,
        priority: filters.priority,
        ...(filters.assigneeId ? { assigneeId: filters.assigneeId } : {}),
        ...(filters.creatorId ? { creatorId: filters.creatorId } : {}),
        ...(filters.overdue ? { dueDate: { lt: new Date() } } : {}),
      },
      orderBy: { dueDate: filters.dueOrder || "asc" },
      include: {
        creator: true,
        assignee: true,
      },
    }),
};


