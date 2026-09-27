import { z } from "zod";

export const createMaterialSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, "Content is required"),
});

export const updateMaterialSchema = createMaterialSchema.partial();

export type CreateMaterialInput = z.infer<
  typeof createMaterialSchema
>;

export type UpdateMaterialInput = z.infer<
  typeof updateMaterialSchema
>;