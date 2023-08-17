import { z } from "zod";
export const QuizCreationSchema = z.object({
  topic: z
    .string()
    .min(4, { message: "Topic should be at least 4 char long" })
    .max(20, { message: "topic char count exceded" }),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
});
export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});
export const endGameSchema = z.object({
  gameId: z.string(),
});
