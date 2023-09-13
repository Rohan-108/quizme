import { prisma } from "@/lib/db";
import { endGameSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { gameId } = endGameSchema.parse(body);

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });
    if (!game) {
      return NextResponse.json(
        {
          message: "Game not found",
        },
        {
          status: 404,
        }
      );
    }
    await prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        timeStarted: new Date(),
      },
    });
    return NextResponse.json({
      gameId: game.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
