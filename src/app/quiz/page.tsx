import QuizCreation from "@/components/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";
import { QuizCreationSchema } from "@/schemas/form/quiz";
import { z } from "zod";
type Input = z.infer<typeof QuizCreationSchema>;
interface Props {
  searchParams: {
    topic: Input["topic"];
  };
}

const page = async ({ searchParams }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }
  return (
    <div>
      <QuizCreation topic={searchParams.topic} />
    </div>
  );
};

export default page;
