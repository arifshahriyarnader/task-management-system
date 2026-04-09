import { databasePool } from "../../shared/database";
import { ApiError } from "../../shared/utils";
import {
  AuditLogWithActor,
  CreateAuditLogInput,
  GetAuditLogsResponse,
} from "./audit.types";

export const createAuditLogService = async (
  input: CreateAuditLogInput,
): Promise<void> => {
    console.log("📝 Creating audit log:", input.action_type, input.entity_id);
  await databasePool.query(
    `INSERT INTO audit_logs
       (actor_id, action_type, entity_type, entity_id, before_data, after_data)
     VALUES ($1, $2, 'TASK', $3, $4, $5)`,
    [
      input.actor_id,
      input.action_type,
      input.entity_id,
      input.before_data ? JSON.stringify(input.before_data) : null,
      input.after_data ? JSON.stringify(input.after_data) : null,
    ],
  );
};

export const getAuditLogsService = async (
  page: number = 1,
  limit: number = 10,
  entity_id?: string,
  actor_id?: string,
): Promise<GetAuditLogsResponse> => {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (entity_id) {
    conditions.push(`al.entity_id = $${paramIndex++}`);
    values.push(entity_id);
  }

  if (actor_id) {
    conditions.push(`al.actor_id = $${paramIndex++}`);
    values.push(actor_id);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await databasePool.query(
    `SELECT COUNT(*) FROM audit_logs al ${whereClause}`,
    values,
  );

  const total = parseInt(countResult.rows[0].count, 10);

  const limitIndex  = paramIndex++;
const offsetIndex = paramIndex++;

values.push(limit);
values.push(offset);

  const result = await databasePool.query<AuditLogWithActor>(
    `SELECT
        al.id,
        al.actor_id,
        al.action_type,
        al.entity_type,
        al.entity_id,
        al.before_data,
        al.after_data,
        al.created_at,
        u.name  AS actor_name,
        u.email AS actor_email
     FROM audit_logs al
     INNER JOIN users u ON u.id = al.actor_id
     ${whereClause}
     ORDER BY al.created_at DESC
     LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
    values,
  );

  return {
    logs: result.rows,
    total,
    page,
    limit,
  };
};

export const getAuditLogByIdService = async (
  id: string,
): Promise<AuditLogWithActor> => {
  const result = await databasePool.query<AuditLogWithActor>(
    `SELECT
        al.id,
        al.actor_id,
        al.action_type,
        al.entity_type,
        al.entity_id,
        al.before_data,
        al.after_data,
        al.created_at,
        u.name  AS actor_name,
        u.email AS actor_email
     FROM audit_logs al
     INNER JOIN users u ON u.id = al.actor_id
     WHERE al.id = $1`,
    [id],
  );

  const log = result.rows[0];
  if (!log) throw new ApiError(404, "Audit log not found");
  return log;
};
