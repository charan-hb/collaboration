export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  creatorId: string;
  assigneeId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  assignee?: User | null;
  creator?: User;
}

export interface Filters {
  status?: Status;
  priority?: Priority;
  dueOrder?: "asc" | "desc";
  assignedToMe?: boolean;
  createdByMe?: boolean;
  overdue?: boolean;
}
