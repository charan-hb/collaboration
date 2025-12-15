import type { ReactNode } from "react";
import { useAuth } from "../state/AuthContext";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Collaborative Task Manager
            </h1>
            <p className="text-sm text-slate-500">
              Real-time tasks with auth, filtering, and assignments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <p className="font-medium text-slate-800">{user?.name}</p>
              <p className="text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </div>
  );
};


