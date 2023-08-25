import { z } from "zod";
import { QuizCreationSchema } from "../form/quiz";

type Input = z.infer<typeof QuizCreationSchema>;
export interface quizQuestion {
  category: Input["topic"];
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: Question;
  tags: string[];
  type: Type;
  difficulty: Input["difficulties"];
  regions: any[];
  isNiche: boolean;
}
interface Question {
  text: string;
}

enum Type {
  TextChoice = "text_choice",
}
