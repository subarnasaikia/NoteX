"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { fetchAllContents } from "@/lib/api/notesApi";
import { createRevision, fetchAllRevisions } from "@/lib/api/revisionApi";
import { Note, Revision } from "@/types";

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

export default function FlashcardRevision() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
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
    const getRevisions = async () => {
      try {
        const res = await fetchAllRevisions();
        setRevisions(res.data);
      } catch (err) {
        toast.error("Failed to load flashcards.");
        console.error(err);
      }
    };
    getRevisions();
  }, []);

  const generateRevision = async () => {
    if (!selectedNoteId) {
      toast.error("Please select a note first.");
      return;
    }

    try {
      setIsGenerating(true);
      toast.loading("Generating flashcards...");

      await createRevision({ contentId: selectedNoteId });

      toast.dismiss();
      location.reload();
      toast.success("Flashcards created successfully!");
    } catch (error) {
      toast.dismiss();
      console.error("Failed to create flashcards:", error);
      toast.error("Failed to create flashcards.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main>
      <SiteHeader title="Revision" />

      <div className="p-4 space-y-6">
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Flashcard</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Note to Create Flashcard</DialogTitle>
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
                <Button onClick={generateRevision} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Create Flashcard"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {revisions.map((card) => (
            <Link key={card._id} href={`/dashboard/revision/${card._id}`}>
              <Card className="p-5 rounded-2xl border border-border shadow-md hover:shadow-lg transition-all hover:bg-accent cursor-pointer">
                <h3 className="text-lg font-semibold text-foreground">
                  {card.title}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
