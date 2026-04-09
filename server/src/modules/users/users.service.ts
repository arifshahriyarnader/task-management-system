import { databasePool } from "../../shared/database";
import { ApiError } from "../../shared/utils";
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

export const getUserByIdService = async (id: string): Promise<UserRow> => {
  const result = await databasePool.query<UserRow>(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  const user = result.rows[0];
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
