import { NextResponse } from "next/server";
import { QuizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import axios from "axios";
/// /api/questions
export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { amount, topic, difficulties } = QuizCreationSchema.parse(body);
    const { data: questions } = await axios.get(
      `https://the-trivia-api.com/v2/questions`,
      {
        params: {
          categories: topic,
          limit: amount,
          difficulties: difficulties,
        },
      }
    );
    return NextResponse.json(
      {
        questions,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        error: error.issues,
        status: 400,
      });
    } else {
      console.error("get request error", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
};
