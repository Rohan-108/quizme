import { z } from "zod";
export const QuizCreationSchema = z.object({
  topic: z.enum([
    "science",
    "film_and_tv",
    "music",
    "history",
    "geography",
    "art_and_literature",
    "sport_and_leisure",
    "general_knowledge",
    "science",
    "food_and_drink",
  ]),
  difficulties: z.enum(["easy", "medium", "hard"]),
  amount: z.number().min(5).max(20),
});
export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});
export const endGameSchema = z.object({
  gameId: z.string(),
});
