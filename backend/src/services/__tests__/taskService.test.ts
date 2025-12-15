import { describe, it, expect, vi, beforeEach } from "vitest";

const taskRepository = vi.hoisted(() => ({
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  create: vi.fn(),
  list: vi.fn(),
}));

const userRepository = vi.hoisted(() => ({
  findById: vi.fn(),
}));

const emitTaskEvent = vi.hoisted(() => vi.fn());

vi.mock("../../repositories/taskRepository", () => ({ taskRepository }));
vi.mock("../../repositories/userRepository", () => ({ userRepository }));
vi.mock("../../sockets/hub", () => ({ emitTaskEvent }));

import { taskService } from "../taskService";

describe("taskService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prevents updates from non-owners or non-assignees", async () => {
    taskRepository.findById.mockResolvedValue({
      id: "1",
      creatorId: "owner",
      assigneeId: "assignee",
    });

    await expect(
      taskService.update("1", { title: "test" } as any, "stranger")
    ).rejects.toThrow("Forbidden");
  });

  it("validates assignee existence on create", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      taskService.create(
        {
          title: "t",
          description: "d",
          dueDate: new Date(),
          priority: "LOW" as any,
          status: "TODO" as any,
          assigneeId: "missing",
        },
        "creator"
      )
    ).rejects.toThrow("Assignee not found");
  });

  it("emits events on delete", async () => {
    taskRepository.findById.mockResolvedValue({
      id: "1",
      creatorId: "owner",
    });
    taskRepository.delete.mockResolvedValue({});

    await taskService.remove("1", "owner");
    expect(emitTaskEvent).toHaveBeenCalledWith("task:deleted", { id: "1" });
  });
});

