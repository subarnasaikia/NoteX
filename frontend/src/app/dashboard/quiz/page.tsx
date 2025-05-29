"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BarChart2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { fetchAllContents } from "@/lib/api/notesApi";
import { createQuiz, fetchAllQuizzes } from "@/lib/api/quizApi";
import { Note, Quiz } from "@/types";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";



export default function FlashcardRevision() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await fetchAllContents();
        setNotes(res.data);
      } catch (err) {
        toast.error("Failed to load notes.");
        console.error(err);
      }
    };

    getNotes();
  }, []);


 useEffect(() => {
    const getQuizzes = async () => {
      try {
        const res = await fetchAllQuizzes();
        setQuizzes(res.data);
      } catch (err) {
        toast.error("Failed to load notes.");
        console.error(err);
      }
    };

    getQuizzes();
  }, []);


  const generateQuiz = async () => {
    if (!selectedNoteId) {
      toast.error("Please select a note first.");
      return;
    }

    try {
      setIsGenerating(true);
      toast.loading("Generating quiz...");

    await createQuiz({contentId: selectedNoteId});

      toast.dismiss();
      location.reload(); 
      
      toast.success("Quiz generated successfully!");
    } catch (error) {
      toast.dismiss();
      console.error("Failed to generate quiz:", error);
      toast.error("Failed to generate quiz.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main>
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
                <Select onValueChange={(value) => setSelectedNoteId(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a note..." />
                  </SelectTrigger>
                  <SelectContent>
                    {notes.map((note) => (
                      <SelectItem key={note._id} value={note._id}>
                        {note.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button onClick={generateQuiz} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Create Quiz"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Card
              key={quiz._id}
              className="p-5 rounded-2xl border border-border shadow-md hover:shadow-lg transition-all hover:bg-accent"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {quiz.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  Based on: <span className="font-medium">{quiz.title}</span>
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/quiz/${quiz._id}`}>
                    <Button size="sm">
                      {quiz.isAppeared ? "Reappear" : "Appear"}
                    </Button>
                  </Link>

                  {quiz.isAppeared && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/quiz/${quiz._id}/results`}>
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
                    </TooltipProvider>
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
