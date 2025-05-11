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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

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

      </div>

    </main>
  );
}
