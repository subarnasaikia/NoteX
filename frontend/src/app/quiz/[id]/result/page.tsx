"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Timer, Percent } from "lucide-react"

const mockResults = {
  quizTitle: "General Knowledge",
  score: 2,
  total: 3,
  duration: "1 min 23 sec",
  results: [
    {
      question: "What is the capital of France?",
      selected: "Paris",
      correct: "Paris",
    },
    {
      question: "What is 2 + 2?",
      selected: "4",
      correct: "4",
    },
    {
      question: "What is the largest planet?",
      selected: "Earth",
      correct: "Jupiter",
    },
  ],
}

export default function ResultsPage() {
  const percentage = Math.round((mockResults.score / mockResults.total) * 100)
  const correctCount = mockResults.results.filter(
    (r) => r.selected === r.correct
  ).length
  const incorrectCount = mockResults.total - correctCount

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Quiz Results</h1>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>{mockResults.quizTitle}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Here’s how you did:
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xl font-bold">{mockResults.score}</p>
            <p className="text-sm text-muted-foreground">Correct</p>
          </div>
          <div>
            <p className="text-xl font-bold">{incorrectCount}</p>
            <p className="text-sm text-muted-foreground">Incorrect</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-xl font-bold">
              <Percent className="w-5 h-5" /> {percentage}%
            </div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-xl font-bold">
              <Timer className="w-5 h-5" /> {mockResults.duration}
            </div>
            <p className="text-sm text-muted-foreground">Time Taken</p>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Answer Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockResults.results.map((item, index) => {
            const isCorrect = item.selected === item.correct
            return (
              <div
                key={index}
                className="space-y-1 border-b pb-4 last:border-none last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.question}</p>
                  {isCorrect ? (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 text-green-600 bg-green-100"
                    >
                      <CheckCircle className="w-4 h-4" /> Correct
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1 text-red-600 bg-red-100"
                    >
                      <XCircle className="w-4 h-4" /> Incorrect
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Your Answer:{" "}
                  <span className="text-foreground">{item.selected}</span>
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground">
                    Correct Answer:{" "}
                    <span className="text-foreground">{item.correct}</span>
                  </p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </main>
  )
}
