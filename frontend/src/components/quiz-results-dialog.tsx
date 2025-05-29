import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchQuizResults } from "@/lib/api/quizApi";

export function QuizResultsDialog({
  quizId,
  open,
  onOpenChange,
}: {
  quizId: string;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
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
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Quiz Results</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Loading...</p>
        ) : results ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{results.title}</h2>
            <p>Total Questions: {results.totalQuestions}</p>
            <p>Correct Answers: {results.correctCount}</p>
            <div className="divide-y">
              {results.detailedResults.map((q: any, idx: number) => (
                <div key={idx} className="py-4">
                  <p className="font-medium">
                    Q{idx + 1}. {q.question}
                  </p>
                  <ul className="list-disc list-inside pl-2">
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
                  <p className="text-sm mt-1 italic text-muted-foreground">
                    {q.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                  </p>
                  <p className="text-sm mt-1 text-gray-700">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Something went wrong loading the results.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
