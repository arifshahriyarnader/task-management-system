import { Request, Response } from "express";
import { asyncHandler, apiResponse } from "../../shared/utils";
import { getMeService, loginService } from "./auth.service";
import { LoginInput } from "./auth.validator";
import { AuthRequest } from "../../shared/middleware";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const result = await loginService(input);
  return apiResponse(res, 200, "Login successful", result);
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getMeService(req.user!.userId);
  return apiResponse(res, 200, "User fetched successfully", result);
});
