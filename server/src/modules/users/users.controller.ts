import { Response } from "express";
import { asyncHandler, apiResponse } from "../../shared/utils";
import { AuthRequest } from "../../shared/middleware";
import { getUserByIdService, getUsersService } from "./users.service";

export const getUsers = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const result = await getUsersService();
    return apiResponse(res, 200, "Users fetched successfully", result);
  },
);

export const getUserById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string }; 
    const user = await getUserByIdService(id);
    return apiResponse(res, 200, "User fetched successfully", { user });
  }
);