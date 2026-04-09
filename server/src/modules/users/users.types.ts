export type Role = "ADMIN" | "USER";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: Date;
}

export interface GetUsersResponse {
  users: UserRow[];
  total: number;
}