"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fetchQuizById, submitQuiz } from "@/lib/api/quizApi";
import { QuizQuestion } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function QuizPage() {
  const router = useRouter();
  const { id } = useParams();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      if (typeof id === "string") {
        try {
          const res = await fetchQuizById(id);
          setQuizId(res.data._id);
          setQuestions(res.data.body || []);
          setSelectedAnswers(new Array(res.data.body.length).fill(null));
        } catch (error) {
          console.error("Failed to load quiz:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadQuiz();
  }, [id]);

  const currentQuestion = questions.length > 0 ? questions[currentIndex] : null;
  const selectedOption = selectedAnswers[currentIndex];

  const handleOptionClick = (option: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = option;
    setSelectedAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

const handleSubmit = async () => {
  const payload = {
    quizId,
    answers: selectedAnswers.map((a) => a ?? ""),
  };

  console.log("Submitting quiz with payload:", payload);

  try {
    const res = await toast.promise(
      submitQuiz(payload),
      {
        loading: "Submitting quiz...",
        success: "Quiz submitted successfully!",
        error: "Failed to submit quiz.",
      }
    );

    if (document.referrer) {
    window.location.href = document.referrer;
  } else {
    // Fallback: go to homepage
    window.location.href = "/";
  }

//     router.back();
// router.refresh();
    

    // Optionally handle response
    // console.log("Quiz result:", res);

  } catch (error) {
    console.error("Submit error:", error);
    toast.error("Error in Submission");
    // Toast already handled by toast.promise
  }
};

  if (loading) {
    return <p className="text-center mt-10">Loading quiz...</p>;
  }

  if (!currentQuestion) {
    return <p className="text-center mt-10 text-red-500">No questions found.</p>;
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Quiz</h1>
      <p className="text-sm text-muted-foreground">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <Card className="p-6 pb-10 space-y-4 min-h-[300px]">
        <h2 className="text-lg font-semibold">{currentQuestion.question}</h2>
        <div className="grid gap-2">
          {currentQuestion.options.map((option) => (
            <Button
              key={option}
              variant={selectedOption === option ? "default" : "outline"}
              className={cn("justify-start", {
                "ring-2 ring-primary": selectedOption === option,
              })}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
          Previous
        </Button>
        {currentIndex === questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={!selectedOption}>
            Submit
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!selectedOption}>
            Next
          </Button>
        )}
      </div>
    </main>
  );
}
