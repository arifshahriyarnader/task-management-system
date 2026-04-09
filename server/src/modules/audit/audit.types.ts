export type AuditActionType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "TASK_ASSIGNED"
  | "TASK_STATUS_CHANGED";

export interface AuditLogRow {
  id: string;
  actor_id: string;
  action_type: AuditActionType;
  entity_type: string;
  entity_id: string;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  created_at: Date;
}

export interface AuditLogWithActor extends AuditLogRow {
  actor_name: string;
  actor_email: string;
}

export interface CreateAuditLogInput {
  actor_id: string;
  action_type: AuditActionType;
  entity_id: string;
  before_data: unknown;   
  after_data: unknown;    
}

export interface GetAuditLogsResponse {
  logs: AuditLogWithActor[];
  total: number;
  page: number;
  limit: number;
}