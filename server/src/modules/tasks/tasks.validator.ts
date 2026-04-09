import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters"),
  description: z.string().optional(),
  assigned_user_id: z
    .string({ error: "Assigned user id must be a string" })
    .uuid("Invalid user id format")
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  description: z.string().optional(),
  assigned_user_id: z
    .string()
    .uuid("Invalid user id format")
    .optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "DONE"], {
    error: "Status must be PENDING, PROCESSING or DONE",
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;