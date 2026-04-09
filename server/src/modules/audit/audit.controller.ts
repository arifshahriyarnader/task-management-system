import { Response } from "express";
import { asyncHandler, apiResponse } from "../../shared/utils";
import { AuthRequest } from "../../shared/middleware";
import { getAuditLogsService, getAuditLogByIdService } from "./audit.service";

export const getAuditLogs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const entity_id = req.query.entity_id
      ? (req.query.entity_id as string)
      : undefined;
    const actor_id = req.query.actor_id
      ? (req.query.actor_id as string)
      : undefined;

    const result = await getAuditLogsService(page, limit, entity_id, actor_id);
    return apiResponse(res, 200, "Audit logs fetched successfully", result);
  },
);

export const getAuditLogById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const log = await getAuditLogByIdService(id);
    return apiResponse(res, 200, "Audit log fetched successfully", { log });
  },
);
