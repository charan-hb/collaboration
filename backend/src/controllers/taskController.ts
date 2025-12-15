import { Request, Response } from "express";
import { Status, Priority } from "@prisma/client";
import { taskService } from "../services/taskService";

const parseEnum = <T>(value: string | undefined, enumObj: Record<string, T>): T | undefined => {
  if (!value) return undefined;
  return (enumObj as Record<string, T>)[value as keyof typeof enumObj];
};

export const taskController = {
  list: async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = {
        status: parseEnum(req.query.status as string | undefined, Status),
        priority: parseEnum(req.query.priority as string | undefined, Priority),
        dueOrder: (req.query.dueOrder as "asc" | "desc") || "asc",
        assigneeId: req.query.assignedToMe ? (req.userId as string) : undefined,
        creatorId: req.query.createdByMe ? (req.userId as string) : undefined,
        overdue: req.query.overdue === "true",
      };
      const tasks = await taskService.list(filters);
      res.json({ tasks });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, dueDate, priority, status, assigneeId } = req.body;
      const task = await taskService.create(
        {
          title,
          description,
          dueDate: new Date(dueDate),
          priority,
          status,
          assigneeId,
        },
        req.userId as string
      );
      res.status(201).json({ task });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await taskService.update(
        req.params.id,
        {
          ...req.body,
          ...(req.body.dueDate ? { dueDate: new Date(req.body.dueDate) } : {}),
        },
        req.userId as string
      );
      res.json({ task });
    } catch (err) {
      const message = (err as Error).message;
      const statusCode = message === "Forbidden" ? 403 : message === "Task not found" ? 404 : 400;
      res.status(statusCode).json({ message });
    }
  },

  remove: async (req: Request, res: Response): Promise<void> => {
    try {
      await taskService.remove(req.params.id, req.userId as string);
      res.status(204).send();
    } catch (err) {
      const message = (err as Error).message;
      const statusCode = message === "Forbidden" ? 403 : message === "Task not found" ? 404 : 400;
      res.status(statusCode).json({ message });
    }
  },
};


