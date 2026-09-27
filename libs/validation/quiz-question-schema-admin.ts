import { z } from "zod";

export const createQuizQuestionSchema = z
  .object({
    question: z
      .string()
      .trim()
      .min(1, "Question is required"),

    options: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Option cannot be empty")
      )
      .min(2, "At least 2 options are required")
      .max(6, "Maximum 6 options are allowed"),

    correctAnswer: z
      .number()
      .int()
      .min(0),

    explanation: z
      .string()
      .trim()
      .optional(),

    order: z
      .number()
      .int()
      .min(1, "Order must be at least 1"),
  })
  .refine(
    (data) =>
      data.correctAnswer < data.options.length,
    {
      message:
        "Correct answer must match an option",
      path: ["correctAnswer"],
    }
  );

export const updateQuizQuestionSchema = z.object({
  order: z
    .number()
    .int()
    .min(1, "Order must be at least 1"),
});

export type CreateQuizQuestionInput =
  z.infer<typeof createQuizQuestionSchema>;

export type UpdateQuizQuestionInput =
  z.infer<typeof updateQuizQuestionSchema>;