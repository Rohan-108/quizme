import QuizCreation from "@/components/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  searchParams: {
    topic?: string;
  };
}

const page = async ({ searchParams }: Props) => {
  //   const session = await getAuthSession();
  //   if (!session?.user) {
  //     redirect("/");
  //   }
  return (
    <div>
      <QuizCreation topic={searchParams.topic ?? ""} />
    </div>
  );
};

export default page;
