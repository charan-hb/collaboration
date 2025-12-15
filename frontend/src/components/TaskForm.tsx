import { useState } from "react";
import type { Priority, Status, User } from "../api/types";

type Props = {
  onSubmit: (payload: {
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
    status: Status;
    assigneeId?: string;
  }) => void;
  users: User[];
};

export const TaskForm = ({ onSubmit, users }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [status, setStatus] = useState<Status>("TODO");
  const [assigneeId, setAssigneeId] = useState<string | undefined>();

  return (
    <form
      className="card flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        // Backend expects an RFC 3339 datetime string; convert the value from
        // the datetime-local input (which has no timezone/seconds) to ISO.
        const isoDueDate = new Date(dueDate).toISOString();
        onSubmit({ title, description, dueDate: isoDueDate, priority, status, assigneeId });
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("MEDIUM");
        setStatus("TODO");
        setAssigneeId(undefined);
      }}
    >
      <h2 className="text-lg font-semibold text-slate-900">Create Task</h2>
      <input
        required
        maxLength={100}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="rounded border border-slate-300 px-3 py-2 text-sm"
      />
      <textarea
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="rounded border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col text-sm text-slate-700">
          Due date
          <input
            required
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-700">
          Priority
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col text-sm text-slate-700">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>
        <label className="flex flex-col text-sm text-slate-700">
          Assignee
          <select
            value={assigneeId || ""}
            onChange={(e) => setAssigneeId(e.target.value || undefined)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
        Save Task
      </button>
    </form>
  );
};


