import type { Task, Status, Priority, User } from "../api/types";
import classNames from "classnames";
import { formatDistanceToNow } from "../utils/date";

type Props = {
  task: Task;
  users: User[];
  onUpdate: (id: string, changes: Partial<Task>) => void;
  onDelete: (id: string) => void;
  currentUserId?: string;
};

const statusLabel: Record<Status, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed",
};

const priorityColor: Record<Priority, string> = {
  LOW: "bg-emerald-100 text-emerald-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-amber-100 text-amber-800",
  URGENT: "bg-rose-100 text-rose-800",
};

export const TaskCard = ({ task, users, onUpdate, onDelete, currentUserId }: Props) => {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Due {formatDistanceToNow(task.dueDate)}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
        </div>
        <span
          className={classNames(
            "rounded-full px-3 py-1 text-xs font-semibold",
            priorityColor[task.priority]
          )}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-slate-700">{task.description}</p>

      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded bg-slate-100 px-2 py-1 font-medium">
          {statusLabel[task.status]}
        </span>
        <span className="rounded bg-slate-100 px-2 py-1">
          Created by {task.creator?.name || "Unknown"}
        </span>
        <span className="rounded bg-slate-100 px-2 py-1">
          Assigned to {task.assignee?.name || "Unassigned"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-slate-600">Status:</label>
        <select
          className="rounded border border-slate-300 px-2 py-1 text-sm"
          value={task.status}
          onChange={(e) => onUpdate(task.id, { status: e.target.value as Status })}
        >
          {Object.values(statusLabel).map((label, idx) => {
            const key = Object.keys(statusLabel)[idx] as Status;
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>

        <label className="text-xs text-slate-600">Assignee:</label>
        <select
          className="rounded border border-slate-300 px-2 py-1 text-sm"
          value={task.assigneeId || ""}
          onChange={(e) => onUpdate(task.id, { assigneeId: e.target.value || null })}
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        {currentUserId && task.assigneeId !== currentUserId && (
          <button
            className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => onUpdate(task.id, { assigneeId: currentUserId })}
          >
            Assign to me
          </button>
        )}

        <button
          className="ml-auto rounded-md border border-rose-200 px-3 py-1 text-sm font-medium text-rose-700 hover:bg-rose-50"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};


