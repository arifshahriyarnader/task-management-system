import { databasePool } from "../../shared/database";
import { UserRow, GetUsersResponse } from "./users.types";

export const getUsersService = async (): Promise<GetUsersResponse> => {
  const result = await databasePool.query<UserRow>(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`,
  );

  return {
    users: result.rows,
    total: result.rowCount ?? 0,
  };
};

