"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";
import LoadingQuestions from "@/components/loadingQuestions";
import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
type Props = { accuracy: number; gameId: string };

const ResultsCard = ({ accuracy, gameId }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const { mutate: playAgain, isLoading } = useMutation({
    mutationFn: async (gameId: string) => {
      const response = await axios.post("/api/replay", {
        gameId: gameId,
      });
      return response.data;
    },
  });
  const onSubmit = async (gameId: string) => {
    setShowLoader(true);
    playAgain(gameId, {
      onError: (error: any) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast({
              title: "Error",
              description: "Something went wrong. Please try again later.",
              variant: "destructive",
            });
          }
        }
      },
      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          router.push(`/play/mcq/${gameId}`);
        }, 2000);
      },
    });
  };
  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }
  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-3/5">
        {accuracy > 75 ? (
          <>
            <Trophy className="mr-4" stroke="gold" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-yellow-400">
              <span className="">Impressive!</span>
              <span className="text-sm text-center text-black opacity-50">
                {"> 75% accuracy"}
              </span>
            </div>
          </>
        ) : accuracy > 25 ? (
          <>
            <Trophy className="mr-4" stroke="silver" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-stone-400">
              <span className="">Good job!</span>
              <span className="text-sm text-center text-black opacity-50">
                {"> 25% accuracy"}
              </span>
            </div>
          </>
        ) : (
          <>
            <Trophy className="mr-4" stroke="brown" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-yellow-800">
              <span className="">Nice try!</span>
              <span className="text-sm text-center text-black opacity-50">
                {"< 25% accuracy"}
              </span>
            </div>
          </>
        )}
      </CardContent>
      <CardContent>
        <Button onClick={() => onSubmit(gameId)}>Play Again</Button>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
