import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fetchQuizResults } from "@/lib/api/quizApi";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizResultsDialogProps {
  quizId: string;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export function QuizResultsDialog({ quizId, open, onOpenChange }: QuizResultsDialogProps) {
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchResults = async () => {
      try {
        const res = await fetchQuizResults(quizId);
        setResults(res.data);
      } catch (err) {
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [open, quizId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">📊 Quiz Results</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center py-4 text-muted-foreground">Loading...</p>
        ) : results ? (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{results.title}</h2>
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary">Total Questions: {results.totalQuestions}</Badge>
                <Badge variant="default">Correct Answers: {results.correctCount}</Badge>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  Score: {Math.round((results.correctCount / results.totalQuestions) * 100)}%
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {results.detailedResults.map((q: any, idx: number) => (
                <Card key={idx} className="border border-muted p-4 shadow-sm">
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-base">
                        Q{idx + 1}. {q.question}
                      </p>
                      {q.isCorrect ? (
                        <CheckCircle className="text-green-600" />
                      ) : (
                        <XCircle className="text-red-500" />
                      )}
                    </div>

                    <ul className="list-disc list-inside space-y-1 pl-2">
                      {q.options.map((opt: string) => (
                        <li
                          key={opt}
                          className={cn("text-sm", {
                            "font-semibold text-green-600": opt === q.correctAnswer,
                            "text-red-500 line-through": opt === q.selectedOption && !q.isCorrect,
                          })}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>

                    <div className="text-sm space-y-1">
                      <p className="italic text-muted-foreground">
                        {q.isCorrect ? "✅ Correct Answer" : "❌ Incorrect Answer"}
                      </p>
                      <p className="text-gray-700">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-destructive">Something went wrong loading the results.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
