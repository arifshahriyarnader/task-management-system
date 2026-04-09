import { Router } from "express";
import { getUsers } from "./users.controller";
import { authenticate, authorize } from "../../shared/middleware";

const router = Router();

router.get("/", authenticate, authorize("ADMIN"), getUsers);

export default router;
