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
            Create Flashcard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      </div>

      <div className="grid gap-4">
        {flashcards.map((card) => (
          <Link key={card.id} href={`/dashboard/revision/${card.id}`}>
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
