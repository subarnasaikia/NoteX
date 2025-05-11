"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Assuming you're using shadcn/ui
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const mockQuestions = [
  {
    id: 1,
    type: "mcq",
    question: "What is the capital of France?",
    options: ["Madrid", "Berlin", "Paris", "Lisbon"],
    answer: "Paris",
  },
  {
    id: 2,
    type: "written",
    question: "Write the formula for water.",
    options: [],
    answer: "H2O",
  },
];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState<string>("");
  
  const currentQuestion = mockQuestions[currentIndex];
  const isWritten = currentQuestion.type === "written";

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setWrittenAnswer("");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setWrittenAnswer("");
    }
  };

  const handleSubmit = () => {
    alert("Submitted!");
  };

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Quiz: General Knowledge</h1>
      <p className="text-sm text-muted-foreground">
        Question {currentIndex + 1} of {mockQuestions.length}
      </p>

      <Card className="p-6 pb-10 space-y-4 min-h-[300px]">
        <h2 className="text-lg font-semibold">{currentQuestion.question}</h2>

        {isWritten ? (
          <Textarea
           placeholder="Type your answer here..."
            value={writtenAnswer}
            onChange={(e) => setWrittenAnswer(e.target.value)}
            rows={32
                

            }
         className= "w-full flex-1 resize-none"
          />
        ) : (
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
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
          Previous
        </Button>
        {currentIndex === mockQuestions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={isWritten ? !writtenAnswer : !selectedOption}>
            Submit
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={isWritten ? !writtenAnswer : !selectedOption}>
            Next
          </Button>
        )}
      </div>
    </main>
  );
}
