"use client";
import { z } from "zod";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { QuizCreationSchema } from "@/schemas/form/quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BookOpen, CheckIcon, CopyCheck } from "lucide-react";
import { Separator } from "./ui/seperator";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import LoadingQuestions from "./loadingQuestions";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
type Input = z.infer<typeof QuizCreationSchema>;
type Props = {
  topic: Input["topic"];
};
const topics = [
  { label: "Music", value: "music" },
  { label: "Sports", value: "sport_and_leisure" },
  { label: "Film&Tv", value: "film_and_tv" },
  { label: "Arts", value: "arts_and_literature" },
  { label: "History", value: "history" },
  { label: "Culture", value: "society_and_culture" },
  { label: "Science", value: "science" },
  { label: "Geography", value: "geography" },
  { label: "Food&Drink", value: "food_and_drink" },
  { label: "General Knowledge", value: "general_knowledge" },
] as const;
const QuizCreation = ({ topic: topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const { toast } = useToast();
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, difficulties }: Input) => {
      const response = await axios.post("/api/game", {
        amount,
        topic,
        difficulties,
      });
      return response.data;
    },
  });
  const form = useForm<Input>({
    resolver: zodResolver(QuizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: topicParam,
      difficulties: "medium",
    },
  });
  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions(data, {
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
  form.watch();
  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Topic</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? topics.find((t) => t.value === field.value)
                                  ?.label
                              : "Select Topic"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Select Topic..."
                            className="h-9"
                          />
                          <CommandEmpty>No topic found.</CommandEmpty>
                          <CommandGroup>
                            {topics.map((t) => (
                              <CommandItem
                                value={t.label}
                                key={t.value}
                                onSelect={() => {
                                  form.setValue("topic", t.value);
                                }}
                              >
                                {t.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    t.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This topic will be used to generate quiz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter the amount"
                        {...field}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Please provide amount of question...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues("difficulties") === "easy"
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => {
                    form.setValue("difficulties", "easy");
                  }}
                >
                  <CopyCheck className="w-4 h-4 mr-2" />
                  Easy
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues("difficulties") === "medium"
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => {
                    form.setValue("difficulties", "medium");
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Medium
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues("difficulties") === "hard"
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => {
                    form.setValue("difficulties", "hard");
                  }}
                >
                  <CopyCheck className="w-4 h-4 mr-2" />
                  Hard
                </Button>
              </div>
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default QuizCreation;
