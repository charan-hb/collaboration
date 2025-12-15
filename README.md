# Collaborative Task Manager

Full-stack, TypeScript-first task management app with authentication, CRUD, filtering, sorting, and real-time updates over Socket.io.

## Tech Stack (per requirements)
- Frontend: React 18 + Vite + TypeScript, Tailwind CSS, React Query for data fetching/caching, Socket.io client.
- Backend: Node.js + Express + TypeScript, Prisma ORM, PostgreSQL, JWT auth with HttpOnly cookies, Socket.io server.
- Database: PostgreSQL (via Docker compose by default).

## Features
- User registration/login, profile update, hashed passwords (bcrypt), JWT sessions stored in HttpOnly cookies.
- Task CRUD with validation (Zod) and DTOs; fields include title (<=100 chars), description, dueDate, priority enum, status enum, creatorId, assigneeId.
- Filtering/sorting: status, priority, due date (asc/desc), assigned to me, created by me, overdue view.
- Real-time: live task updates + assignment notifications via Socket.io (per-user rooms).
- Responsive UI, skeleton loading states, dedicated dashboard with creation form.
- Tests: vitest suite covering task service rules (permissions, validation, events).

## Getting Started
Prereqs: Node 18+, npm, Docker (for Postgres) or your own Postgres instance.

### 1) Clone & Install
```bash
cd backend
npm install
npx prisma generate

cd ../frontend
npm install
```

### 2) Configure Environment
- `backend/env.example` → copy to `backend/.env` and adjust.
- `frontend/env.example` → copy to `frontend/.env`.

Key backend vars:
- `DATABASE_URL=postgresql://ctm_user:ctm_pass@localhost:5432/ctm_db?schema=public`
- `CLIENT_ORIGIN=http://localhost:5173`
- `JWT_SECRET=your-secret`
- `PORT=4000`

### 3) Start Postgres (Docker)
```bash
docker-compose up -d
```

### 4) Apply DB schema
```bash
cd backend
npx prisma db push
```

### 5) Run Dev Servers
Backend (w/ sockets): `cd backend && npm run dev` (http://localhost:4000)  
Frontend: `cd frontend && npm run dev` (Vite default http://localhost:5173)

### 6) Testing
```bash
cd backend
npm test
```

## Frontend Structure
- `src/state/AuthContext.tsx` – session bootstrap via `/api/auth/me`, login/register/logout helpers.
- `src/pages/Dashboard.tsx` – filtering, task list, creation form, deletion/update, real-time invalidation via `useSocket`.
- `src/components/*` – layout, filters, task cards, skeletons, task form.
- `src/api/*` – axios client with `withCredentials`, typed task/user endpoints.
- `src/hooks/useSocket.ts` – Socket.io client, auto-invalidates React Query caches on task events.

## Backend Structure
- `src/app.ts` – Express app, CORS + cookies + morgan, healthcheck, routes, global error handler.
- `src/routes` – `/api/auth`, `/api/tasks`, `/api/users` (protected except auth).
- `src/dtos` – Zod schemas for validation.
- `src/services` – auth (hash/JWT) and task business logic (permissions, emits).
- `src/repositories` – Prisma data access (service/repository separation).
- `src/sockets` – Socket.io server using JWT from cookies; per-user rooms; `hub` emitter.
- `src/middleware` – auth guard, validation, error handling.
- `prisma/schema.prisma` – PostgreSQL models + enums.

### API Contract (high level)
- `POST /api/auth/register` `{name,email,password}` → sets HttpOnly cookie, returns user.
- `POST /api/auth/login` `{email,password}` → cookie + user.
- `POST /api/auth/logout` → clears cookie.
- `GET /api/auth/me` → current user.
- `PATCH /api/auth/profile` `{name}`.
- `GET /api/users` → list of users for assignment.
- `GET /api/tasks` query: `status`, `priority`, `dueOrder`, `assignedToMe`, `createdByMe`, `overdue`.
- `POST /api/tasks` create payload matches DTO.
- `PUT /api/tasks/:id` partial update.
- `DELETE /api/tasks/:id` (creator only).

### Real-Time Notes
- Socket.io server authenticates via JWT found in HttpOnly cookie during handshake; clients connect with `withCredentials: true`.
- Events: `task:created`, `task:updated`, `task:deleted`, `task:assigned` (targeted to assignee room).

## Deployment
- Frontend: Vercel/Netlify (build `npm run build`).
- Backend: Render/Railway. Set env vars (DATABASE_URL, CLIENT_ORIGIN, JWT_SECRET, PORT). Run migrations (`npx prisma migrate deploy`).
- Ensure CORS allows deployed frontend URL and sockets.

## Residual Notes / Trade-offs
- Permissions: updates allowed for creator or current assignee; delete restricted to creator.
- Assignment UI supports selecting any user returned by `/api/users` or quick “Assign to me”.
- Minimal test suite focuses on service-layer rules; extend with integration tests as needed.


