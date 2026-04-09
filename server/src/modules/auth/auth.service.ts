import bcrypt from "bcrypt";

import { ApiError } from "../../shared/utils/ApiError";
import { signToken } from "../../shared/utils/token";
import { LoginInput, LoginResponse, UserRow } from "./auth.types";
import { databasePool } from "../../shared/database";

export const loginService = async (
  input: LoginInput,
): Promise<LoginResponse> => {
  const result = await databasePool.query<UserRow>(
    `SELECT id, name, email, password_hash, role
     FROM users
     WHERE email = $1`,
    [input.email],
  );

  const user = result.rows[0];
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(input.password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
