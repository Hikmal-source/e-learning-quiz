import { z } from "zod";

export const createQuizSchema = z.object({
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

  duration: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 minute")
    .max(180, "Duration must not exceed 180 minutes"),
});

export const updateQuizSchema = createQuizSchema
  .extend({
    isPublished: z.boolean().optional(),
  })
  .partial();

export type CreateQuizInput = z.infer<
  typeof createQuizSchema
>;

export type UpdateQuizInput = z.infer<
  typeof updateQuizSchema
>;