import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import MCQ from "@/components/MCQ";
type Props = {
  params: {
    gameId: string;
  };
};

const MCQPage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      Question: {
        select: {
          id: true,
          question: true,
          answer: true,
          options: true,
        },
      },
    },
  });
  if (!game) {
    return redirect("/quiz");
  }
  return <MCQ game={game} />;
};

export default MCQPage;
