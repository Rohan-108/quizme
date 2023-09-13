import { QuizCreationSchema } from "@/schemas/form/quiz";
import { prisma } from "../../../lib/db";
import { getAuthSession } from "@/lib/nextauth";
import axios from "axios";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { quizQuestion } from "@/schemas/apiType/types";
export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    const body = await req.json();
    const { amount, topic, difficulties } = QuizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        timeStarted: new Date(),
        userId: session?.user.id as string,
        topic,
      },
    });
    await prisma.topic_count.upsert({
      where: {
        topic,
      },
      create: {
        topic,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });
    const { data: q } = await axios.post(
      `${process.env.NEXTAUTH_URL}/api/questions`,
      {
        amount,
        topic,
        difficulties,
      }
    );
    const quizData = q.questions.map((quiz: quizQuestion) => {
      const options = quiz.incorrectAnswers;
      options.splice(
        Math.floor(Math.random() * (quiz.incorrectAnswers.length + 1)),
        0,
        quiz.correctAnswer
      );
      return {
        question: quiz.question.text,
        answer: quiz.correctAnswer,
        options: options,
        gameId: game.id,
      };
    });
    await prisma.question.createMany({
      data: quizData,
    });
    return NextResponse.json({
      gameId: game.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "something went wrong",
      },
      { status: 500 }
    );
  }
}
