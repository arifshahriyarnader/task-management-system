import { Response } from "express";
import { asyncHandler, apiResponse } from "../../shared/utils";
import { AuthRequest } from "../../shared/middleware";
import { getUsersService } from "./users.service";

export const getUsers = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const result = await getUsersService();
    return apiResponse(res, 200, "Users fetched successfully", result);
  },
);
