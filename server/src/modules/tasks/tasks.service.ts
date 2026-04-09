import { createAuditLogService } from "../audit/audit.service";
import { databasePool } from "../../shared/database";
import { ApiError } from "../../shared/utils/ApiError";
import {
  TaskRow,
  TaskWithUsers,
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  GetTasksResponse,
} from "./tasks.types";

const getTaskById = async (id: string): Promise<TaskWithUsers> => {
  const result = await databasePool.query<TaskWithUsers>(
    `SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.assigned_user_id,
        t.created_by,
        t.created_at,
        t.updated_at,
        au.name  AS assigned_user_name,
        au.email AS assigned_user_email,
        cu.name  AS created_by_name,
        cu.email AS created_by_email
     FROM tasks t
     LEFT JOIN users au ON au.id = t.assigned_user_id
     INNER JOIN users cu ON cu.id = t.created_by
     WHERE t.id = $1`,
    [id],
  );

  const task = result.rows[0];
  if (!task) throw new ApiError(404, "Task not found");
  return task;
};

export const getTasksService = async (): Promise<GetTasksResponse> => {
  const result = await databasePool.query<TaskWithUsers>(
    `SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.assigned_user_id,
        t.created_by,
        t.created_at,
        t.updated_at,
        au.name  AS assigned_user_name,
        au.email AS assigned_user_email,
        cu.name  AS created_by_name,
        cu.email AS created_by_email
     FROM tasks t
     LEFT JOIN users au ON au.id = t.assigned_user_id
     INNER JOIN users cu ON cu.id = t.created_by
     ORDER BY t.created_at DESC`,
  );

  return {
    tasks: result.rows,
    total: result.rowCount ?? 0,
  };
};

export const getAssignedTasksService = async (
  userId: string,
): Promise<GetTasksResponse> => {
  const result = await databasePool.query<TaskWithUsers>(
    `SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.assigned_user_id,
        t.created_by,
        t.created_at,
        t.updated_at,
        au.name  AS assigned_user_name,
        au.email AS assigned_user_email,
        cu.name  AS created_by_name,
        cu.email AS created_by_email
     FROM tasks t
     LEFT JOIN users au ON au.id = t.assigned_user_id
     INNER JOIN users cu ON cu.id = t.created_by
     WHERE t.assigned_user_id = $1
     ORDER BY t.created_at DESC`,
    [userId],
  );

  return {
    tasks: result.rows,
    total: result.rowCount ?? 0,
  };
};

export const getTaskByIdService = async (
  id: string,
  userId: string,
  role: string,
): Promise<TaskWithUsers> => {
  const task = await getTaskById(id);

  if (role === "USER" && task.assigned_user_id !== userId) {
    throw new ApiError(403, "You do not have permission to view this task");
  }

  return task;
};

export const createTaskService = async (
  input: CreateTaskInput,
  actorId: string,
): Promise<TaskWithUsers> => {
  const result = await databasePool.query<TaskRow>(
    `INSERT INTO tasks (title, description, assigned_user_id, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      input.title,
      input.description ?? null,
      input.assigned_user_id ?? null,
      actorId,
    ],
  );

  const task = await getTaskById(result.rows[0].id);

  await createAuditLogService({
    actor_id: actorId,
    action_type: "TASK_CREATED",
    entity_id: task.id,
    before_data: null,
    after_data: task,
  });

  return task;
};

export const updateTaskService = async (
  id: string,
  input: UpdateTaskInput,
  actorId: string,
): Promise<TaskWithUsers> => {
  const before = await getTaskById(id);

  await databasePool.query(
    `UPDATE tasks
     SET
       title            = COALESCE($1, title),
       description      = COALESCE($2, description),
       assigned_user_id = COALESCE($3, assigned_user_id),
       updated_at       = NOW()
     WHERE id = $4`,
    [
      input.title ?? null,
      input.description ?? null,
      input.assigned_user_id ?? null,
      id,
    ],
  );

  const after = await getTaskById(id);

  const isAssignmentChanged =
    before.assigned_user_id !== after.assigned_user_id;

  await createAuditLogService({
    actor_id: actorId,
    action_type: isAssignmentChanged ? "TASK_ASSIGNED" : "TASK_UPDATED",
    entity_id: id,
    before_data: before,
    after_data: after,
  });

  return after;
};

export const updateTaskStatusService = async (
  id: string,
  input: UpdateTaskStatusInput,
  actorId: string,
  role: string,
): Promise<TaskWithUsers> => {
  const before = await getTaskById(id);

  if (role === "USER" && before.assigned_user_id !== actorId) {
    throw new ApiError(403, "You do not have permission to update this task");
  }

  await databasePool.query(
    `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2`,
    [input.status, id],
  );

  const after = await getTaskById(id);

  await createAuditLogService({
    actor_id: actorId,
    action_type: "TASK_STATUS_CHANGED",
    entity_id: id,
    before_data: before,
    after_data: after,
  });

  return after;
};
export const deleteTaskService = async (
  id: string,
  actorId: string,
): Promise<void> => {
  const before = await getTaskById(id);

  await databasePool.query(`DELETE FROM tasks WHERE id = $1`, [id]);

  await createAuditLogService({
    actor_id: actorId,
    action_type: "TASK_DELETED",
    entity_id: id,
    before_data: before,
    after_data: null,
  });
};
