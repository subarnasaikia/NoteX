import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { BarChart2 } from "lucide-react";

const quizzes = [
  {
    id: "1",
    title: "Biology Quiz - Cell Structure",
    noteTitle: "Cell Structure Notes",
    hasAppeared: true,
  },
  {
    id: "2",
    title: "Calculus Basics",
    noteTitle: "Limits and Derivatives",
    hasAppeared: false,
  },
];


const flashcards = [
  { id: "1", title: "Biology - Cell Structure" },
  { id: "2", title: "Math - Calculus Basics" },
  { id: "3", title: "History - World War II" },
];

const notes = [
  { id: "note-1", title: "Math - Algebra" },
  { id: "note-2", title: "Physics - Motion" },
  { id: "note-3", title: "History - WWI" },
]

export default function FlashcardRevision() {
  return (
    <main >
      <SiteHeader title="Quiz" />

      <div className="p-4 space-y-6">
                  <div className="flex justify-end">

   <Dialog>
      <DialogTrigger asChild>
        <Button>Create Quiz</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Note to create Quiz</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a note..." />
            </SelectTrigger>
            <SelectContent>
              {notes.map((note) => (
                <SelectItem key={note.id} value={note.id}>
                  {note.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button >
            Create Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    </div>
     <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="p-5 rounded-2xl border border-border shadow-md hover:shadow-lg transition-all hover:bg-accent"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {quiz.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  Based on: <span className="font-medium">{quiz.noteTitle}</span>
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/quiz/${quiz.id}`}>
                    <Button size="sm">
                      {quiz.hasAppeared ? "Reappear" : "Appear"}
                    </Button>
                  </Link>

                  {quiz.hasAppeared && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/quiz/${quiz.id}/results`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="transition hover:bg-muted hover:text-primary"
                          >
                            <BarChart2 className="w-5 h-5" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>View Results</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </main>
  );
}
