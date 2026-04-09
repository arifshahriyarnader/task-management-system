import { Router } from "express";
import { getUserById, getUsers } from "./users.controller";
import { authenticate, authorize } from "../../shared/middleware";

const router = Router();

router.get("/", authenticate, authorize("ADMIN"), getUsers);
router.get("/:id", authenticate, authorize("ADMIN"), getUserById);


export default router;
