# Task Management System

A backend REST API for a role-based task management system with audit logging, built with Node.js, Express.js, TypeScript, and PostgreSQL.

---

## Tech Stack

| Technology | Reason |
|---|---|
| **Node.js + Express.js** | Lightweight, unopinionated, and fast to build with. Chosen over NestJS due to existing hands-on experience — every architectural decision in this project is one I can fully explain and defend. |
| **TypeScript** | Type safety across the entire codebase. Catches bugs at compile time rather than runtime. |
| **PostgreSQL** | Relational data fits naturally for tasks, users, and audit logs. Used raw `pg` driver instead of Prisma or TypeORM because I wanted full control over queries and have not used those ORMs in production before — I chose honesty over over-engineering. |
| **Zod** | Runtime request validation with TypeScript type inference. Cleaner than manual validation. |
| **Modular Monolith** | Chosen over MVC and Microservices — explained in detail below. |

---

## Why Modular Monolith Instead of MVC

Traditional MVC organizes code by **type** (all controllers together, all models together, all services together). This works for small apps but becomes hard to navigate as the project grows — to understand one feature you have to jump across multiple folders.

A modular monolith organizes code by **feature** (everything related to tasks lives in the tasks module, everything related to audit lives in the audit module). This means:

- Each module is self-contained — types, validation, service, controller, routes all in one place
- Easy to reason about — open one folder, understand one feature completely
- Modules communicate through service imports, not HTTP — no network overhead like microservices
- Simple to deploy — one application, one database, one Docker container
- Scales well enough for this project size without the complexity of microservices

**Why not Microservices?** Microservices introduce distributed system complexity — network failures, service discovery, inter-service authentication — that is not justified for a project of this scope. Modular monolith gives clean separation without that overhead.

**Why not plain MVC?** MVC does not enforce module boundaries. A modular monolith does — each module owns its own code and the only shared code lives in `shared/`.

---

## Why PostgreSQL with Raw `pg`

PostgreSQL was chosen because the data model is naturally relational:
- Users have tasks
- Tasks have an assigned user and a creator
- Audit logs reference both users and tasks via foreign keys

Raw `pg` was chosen over Prisma or TypeORM because:
- I have not used either ORM in a production project before
- I did not want to introduce tools I cannot fully explain or debug under pressure
- Raw SQL gives full control — joins, constraints, JSONB for audit data, all explicit
- Every query in this project is intentional and readable

This decision is documented honestly — using an ORM I am unfamiliar with would have introduced risk without benefit.

---

## Architecture

```
Modular Monolith — each module owns its types, validation, service, controller, and routes.
Shared code (db, middleware, utils) lives in src/shared/ only.
Modules never import from each other's controllers or routes.
tasks.service.ts is the only module that calls audit.service.ts internally.
```

---

## Folder Structure

```
task-management-system/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── app.config.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── auth.validator.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── auth.routes.ts
│   │   │   ├── users/
│   │   │   │   ├── users.types.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   └── users.routes.ts
│   │   │   ├── tasks/
│   │   │   │   ├── tasks.types.ts
│   │   │   │   ├── tasks.validator.ts
│   │   │   │   ├── tasks.service.ts
│   │   │   │   ├── tasks.controller.ts
│   │   │   │   └── tasks.routes.ts
│   │   │   └── audit/
│   │   │       ├── audit.types.ts
│   │   │       ├── audit.service.ts
│   │   │       ├── audit.controller.ts
│   │   │       └── audit.routes.ts
│   │   ├── shared/
│   │   │   ├── database.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authenticate.ts
│   │   │   │   ├── authorize.ts
│   │   │   │   ├── errorHandler.ts
│   │   │   │   └── validate.ts
│   │   │   └── utils/
│   │   │       ├── ApiError.ts
│   │   │       ├── apiResponse.ts
│   │   │       ├── asyncHandler.ts
│   │   │       └── token.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   └── app.ts
│   ├── migrations/
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_tasks_table.sql
│   │   ├── 003_create_audit_logs_table.sql
│   │   └── migrate.ts
│   ├── seeds/
│   │   └── seed.ts
│   ├── .env.example
│   ├── nodemon.json
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

---

## Database Schema

### users
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(150) | Unique email |
| password_hash | TEXT | Bcrypt hashed password |
| role | VARCHAR(20) | ADMIN or USER |
| created_at | TIMESTAMP | Created timestamp |

### tasks
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| title | VARCHAR(200) | Task title |
| description | TEXT | Optional description |
| status | VARCHAR(20) | PENDING, PROCESSING, DONE |
| assigned_user_id | UUID | FK → users |
| created_by | UUID | FK → users |
| created_at | TIMESTAMP | Created timestamp |
| updated_at | TIMESTAMP | Last updated timestamp |

### audit_logs
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| actor_id | UUID | FK → users (who did it) |
| action_type | VARCHAR(50) | TASK_CREATED, TASK_UPDATED, TASK_DELETED, TASK_ASSIGNED, TASK_STATUS_CHANGED |
| entity_type | VARCHAR(50) | Always TASK |
| entity_id | UUID | FK → tasks |
| before_data | JSONB | State before the action |
| after_data | JSONB | State after the action |
| created_at | TIMESTAMP | Log timestamp |

---

## API Endpoints

### Auth
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Public | Login and get JWT |
| GET | `/api/v1/auth/me` | Auth | Get current user |

### Users
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/v1/users` | ADMIN | Get all users |
| GET | `/api/v1/users/:id` | ADMIN | Get user by ID |

### Tasks
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/v1/tasks` | ADMIN | Create task |
| GET | `/api/v1/tasks` | ADMIN | Get all tasks |
| GET | `/api/v1/tasks/assigned` | ADMIN, USER | Get assigned tasks |
| GET | `/api/v1/tasks/:id` | ADMIN, USER | Get task by ID |
| PUT | `/api/v1/tasks/:id` | ADMIN | Update task |
| PATCH | `/api/v1/tasks/:id/status` | ADMIN, USER | Update task status |
| DELETE | `/api/v1/tasks/:id` | ADMIN | Delete task |

### Audit Logs
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/v1/audit` | ADMIN | Get all audit logs |
| GET | `/api/v1/audit?actor_id=` | ADMIN | Filter by actor |
| GET | `/api/v1/audit?entity_id=` | ADMIN | Filter by task |
| GET | `/api/v1/audit/:id` | ADMIN | Get single audit log |

---

## Demo Credentials

```
Admin  → admin@taskapp.com  / Admin@123
User 1 → user1@taskapp.com  / User@123
User 2 → user2@taskapp.com  / User@123
...
User 10 → user10@taskapp.com / User@123
```
---

## 🐳 Docker Setup (Recommended)

The easiest way to run the project. No manual database setup needed — tables and users are seeded automatically.

### Prerequisites
- Docker Desktop installed and running

### Run with Docker

```bash
# 1. Clone the repo
git clone git@github.com:arifshahriyarnader/task-management-system.git
cd task-management-system

# 2. Start everything
docker compose up -d

# 3. Check logs
docker compose logs -f
```

You should see:

```
task-management-db      | database system is ready to accept connections
task-management-server  | Server is running on port 5001
task-management-server  | Database connected successfully
```

### What Docker does automatically

```
docker compose up
  └── starts PostgreSQL container
        └── runs init.sql automatically
              ├── creates users table
              ├── creates tasks table
              ├── creates audit_logs table
              ├── inserts 1 admin user
              └── inserts 10 normal users
  └── starts backend server
        └── connects to PostgreSQL
              └── API ready at http://localhost:5001
```

### Docker commands

```bash
# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop containers (keeps DB data)
docker compose down

# Stop and delete DB data (fresh start)
docker compose down -v

# Rebuild after code changes
docker compose up --build -d
```


---

## Local Setup (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Steps

```bash
# 1. Clone the repo
git clone git@github.com:arifshahriyarnader/task-management-system.git
cd task-management-system/server

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Fill in your DATABASE_URL and JWT_SECRET

# 4. Run migrations
npm run migrate

# 5. Seed predefined users
npm run seed

# 6. Start development server
npm run dev
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskdb
JWT_SECRET=your_secret_here
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000
```

---

## Postman Collection

All API endpoints with example requests and responses:

👉 [View Postman Collection](https://drive.google.com/file/d/1KjvRMfOZ8HzMYQEemhCRJ7VlVAAOe7ec/view?usp=sharing)

---

## Audit Log Flow

Every mutating task operation automatically creates an audit log inside the service layer — not in the controller or route. This keeps the logging concern encapsulated:

```
POST /tasks
  └── createTaskService
        ├── INSERT into tasks
        ├── fetch full task with joins
        └── createAuditLogService → INSERT into audit_logs
              ├── actor_id  (who created)
              ├── action_type: TASK_CREATED
              ├── before_data: null
              └── after_data: full task object
```

---

## Trade-offs & Decisions

| Decision | Trade-off |
|---|---|
| Modular monolith over microservices | Simpler deployment, no distributed system complexity |
| Raw `pg` over Prisma/TypeORM | Full query control, no magic — but more verbose |
| Express over NestJS | Faster to build with existing knowledge — but less opinionated structure |
| JWT only, no refresh token | Simpler auth flow as per assignment requirement |
| No frontend | Focused on backend quality over feature quantity |