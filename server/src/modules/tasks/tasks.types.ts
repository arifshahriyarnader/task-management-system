export type TaskStatus = "PENDING" | "PROCESSING" | "DONE";

export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigned_user_id: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskWithUsers extends TaskRow {
  assigned_user_name: string | null;
  assigned_user_email: string | null;
  created_by_name: string;
  created_by_email: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  assigned_user_id?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  assigned_user_id?: string;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

export interface GetTasksResponse {
  tasks: TaskWithUsers[];
  total: number;
}