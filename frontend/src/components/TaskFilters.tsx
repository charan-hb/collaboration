import type{ Filters, Priority, Status } from "../api/types";

type Props = {
  filters: Filters;
  onChange: (next: Filters) => void;
};

const statusOptions: { label: string; value?: Status }[] = [
  { label: "All", value: undefined },
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Review", value: "REVIEW" },
  { label: "Completed", value: "COMPLETED" },
];

const priorityOptions: { label: string; value?: Priority }[] = [
  { label: "All", value: undefined },
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
];

export const TaskFilters = ({ filters, onChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        value={filters.status || ""}
        onChange={(e) =>
          onChange({ ...filters, status: (e.target.value as Status) || undefined })
        }
      >
        {statusOptions.map((opt) => (
          <option key={opt.label} value={opt.value || ""}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        value={filters.priority || ""}
        onChange={(e) =>
          onChange({
            ...filters,
            priority: (e.target.value as Priority) || undefined,
          })
        }
      >
        {priorityOptions.map((opt) => (
          <option key={opt.label} value={opt.value || ""}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        value={filters.dueOrder || "asc"}
        onChange={(e) => onChange({ ...filters, dueOrder: e.target.value as "asc" | "desc" })}
      >
        <option value="asc">Due date ↑</option>
        <option value="desc">Due date ↓</option>
      </select>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={!!filters.assignedToMe}
          onChange={(e) => onChange({ ...filters, assignedToMe: e.target.checked })}
        />
        Assigned to me
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={!!filters.createdByMe}
          onChange={(e) => onChange({ ...filters, createdByMe: e.target.checked })}
        />
        Created by me
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={!!filters.overdue}
          onChange={(e) => onChange({ ...filters, overdue: e.target.checked })}
        />
        Overdue
      </label>
    </div>
  );
};


