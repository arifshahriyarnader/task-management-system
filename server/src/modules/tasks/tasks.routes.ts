import { Router } from "express";
import {
  getTasks,
  getAssignedTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "./tasks.controller";
import { authenticate, authorize } from "../../shared/middleware";

const router = Router();

router.get("/get-all-tasks", authenticate, authorize("ADMIN"), getTasks);
router.post("/create-task", authenticate, authorize("ADMIN"), createTask);
router.put("/:id", authenticate, authorize("ADMIN"), updateTask);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteTask);

router.get(
  "/assigned",
  authenticate,
  authorize("ADMIN", "USER"),
  getAssignedTasks,
);
router.get("/:id", authenticate, authorize("ADMIN", "USER"), getTaskById);
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "USER"),
  updateTaskStatus,
);

export default router;
