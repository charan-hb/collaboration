import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createTask, deleteTask, fetchTasks, updateTask } from "../api/tasks";
import { fetchUsers } from "../api/users";
import type { Filters, Task } from "../api/types";
import { Layout } from "../components/Layout";
import { TaskCard } from "../components/TaskCard";
import { TaskFilters } from "../components/TaskFilters";
import { TaskForm } from "../components/TaskForm";
import { Skeleton } from "../components/Skeleton";
import { useAuth } from "../state/AuthContext";
import { useSocket } from "../hooks/useSocket";

export const DashboardPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Filters>({ dueOrder: "asc" });

  useSocket();

  const tasksQuery = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => fetchTasks(filters),
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: Partial<Task> }) =>
      updateTask(id, changes),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: invalidate,
  });

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Dashboard</p>
                <p className="text-xs text-slate-500">
                  Filter by status, priority, due date, and ownership
                </p>
              </div>
              <TaskFilters filters={filters} onChange={setFilters} />
            </div>
          </div>

          {tasksQuery.isLoading ? (
            <Skeleton lines={5} />
          ) : (
            <div className="space-y-3">
              {tasksQuery.data?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  users={usersQuery.data || []}
                  currentUserId={user?.id}
                  onUpdate={(id, changes) =>
                    updateMutation.mutate({ id, changes: changes as Partial<Task> })
                  }
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
              {tasksQuery.data?.length === 0 && (
                <div className="card text-sm text-slate-600">
                  No tasks found. Try a different filter or create one below.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <TaskForm
            users={usersQuery.data || []}
            onSubmit={(payload) => createMutation.mutate(payload as any)}
          />
          <div className="card space-y-2 text-sm text-slate-700">
            <h3 className="text-base font-semibold text-slate-900">Tips</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Assign tasks to teammates to trigger assignment notifications.</li>
              <li>Use the overdue toggle to focus on time-sensitive items.</li>
              <li>Changes propagate instantly through Socket.io.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};


