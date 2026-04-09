import { databasePool } from "../../shared/database";
import { CreateAuditLogInput } from "./audit.types";

export const createAuditLogService = async (
  input: CreateAuditLogInput,
): Promise<void> => {
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
