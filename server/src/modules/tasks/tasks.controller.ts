import { Response } from "express";
import { asyncHandler, apiResponse } from "../../shared/utils";
import { AuthRequest } from "../../shared/middleware";
import {
  getTasksService,
  getAssignedTasksService,
  getTaskByIdService,
  createTaskService,
  updateTaskService,
  updateTaskStatusService,
  deleteTaskService,
} from "./tasks.service";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "./tasks.validator";

export const getTasks = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const result = await getTasksService();
    return apiResponse(res, 200, "Tasks fetched successfully", result);
  },
);

export const getAssignedTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await getAssignedTasksService(req.user!.userId);
    return apiResponse(res, 200, "Assigned tasks fetched successfully", result);
  },
);

export const getTaskById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const role = req.user!.role;

    const task = await getTaskByIdService(id, userId, role);
    return apiResponse(res, 200, "Task fetched successfully", { task });
  },
);
export const createTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const task = await createTaskService(parsed.data, req.user!.userId);
    return apiResponse(res, 201, "Task created successfully", { task });
  },
);
export const updateTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const id = req.params.id as string; 
    const task = await updateTaskService(id, parsed.data, req.user!.userId);
    return apiResponse(res, 200, "Task updated successfully", { task });
  },
);

export const updateTaskStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const parsed = updateTaskStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const id = req.params.id as string;
    const userId = req.user!.userId;
    const role = req.user!.role;

    const task = await updateTaskStatusService(id, parsed.data, userId, role);
    return apiResponse(res, 200, "Task status updated successfully", { task });
  },
);

export const deleteTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string; 
    await deleteTaskService(id, req.user!.userId);
    return apiResponse(res, 200, "Task deleted successfully", {});
  },
);
