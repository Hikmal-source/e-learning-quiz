import { z } from "zod";

const questionFields = {
  question: z
    .string()
    .trim()
    .min(1, "Question is required"),

  options: z
    .array(
      z.string().trim().min(1, "Option cannot be empty")
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
};

export const createQuestionSchema = z
  .object(questionFields)
  .refine(
    (data) =>
      data.correctAnswer < data.options.length,
    {
      message:
        "Correct answer must match an option",
      path: ["correctAnswer"],
    }
  );

export const updateQuestionSchema = z
  .object(questionFields)
  .partial()
  .refine(
    (data) => {
      if (
        data.correctAnswer === undefined ||
        data.options === undefined
      ) {
        return true;
      }

      return (
        data.correctAnswer <
        data.options.length
      );
    },
    {
      message:
        "Correct answer must match an option",
      path: ["correctAnswer"],
    }
  );

export type CreateQuestionInput = z.infer<
  typeof createQuestionSchema
>;

export type UpdateQuestionInput = z.infer<
  typeof updateQuestionSchema
>;