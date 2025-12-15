import { Router } from "express";
import { taskController } from "../controllers/taskController";
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "../dtos/task.dto";

export const taskRoutes = Router();

taskRoutes.get("/", taskController.list);
taskRoutes.post("/", validate(createTaskSchema), taskController.create);
taskRoutes.put("/:id", validate(updateTaskSchema), taskController.update);
taskRoutes.delete("/:id", taskController.remove);


