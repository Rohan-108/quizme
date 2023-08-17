import { QuizCreationSchema } from "@/schemas/form/quiz";
import { prisma } from "../../../lib/db";
import { getAuthSession } from "@/lib/nextauth";
import axios from "axios";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
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
    const { data } = await axios.post(`${process.env.URL}/api/questions`, {
      amount,
      topic,
      difficulties,
    });
    type mcqQuestion = {
      category: string;
      id: string;
      correctAnswer: string;
      incorrectAnswer: string[];
      question: {
        text: string;
      };
      tags: string[];
      type: string;
      regions: [];
      isNiche: boolean;
    };
    let manyData = data.map((question: mcqQuestion) => {
      let options = [
        question.correctAnswer,
        question.incorrectAnswer[0],
        question.incorrectAnswer[1],
        question.incorrectAnswer[2],
      ];
      options = options.sort(() => Math.random() - 0.5);
      return {
        question: question.question.text,
        answer: question.correctAnswer,
        options: JSON.stringify(options),
        gameId: game.id,
      };
    });
    await prisma.question.createMany({
      data: manyData,
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
