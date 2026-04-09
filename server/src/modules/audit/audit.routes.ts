import { Router } from "express";
import { getAuditLogs, getAuditLogById } from "./audit.controller";
import { authenticate, authorize } from "../../shared/middleware";

const router = Router();

router.get("/", authenticate, authorize("ADMIN"), getAuditLogs);
router.get("/:id", authenticate, authorize("ADMIN"), getAuditLogById);

export default router;