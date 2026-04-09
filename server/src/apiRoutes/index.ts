import {Router} from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/users.routes";
import taskRoutes from "../modules/tasks/tasks.routes";
import auditRoutes from "../modules/audit/audit.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/audit", auditRoutes);

export default router;