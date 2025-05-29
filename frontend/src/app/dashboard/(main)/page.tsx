"use client";

import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PlusCircle, EllipsisVertical  } from "lucide-react";
import { isColorDark } from "@/lib/utils";
import { NoteCard } from "@/components/note-card";
import { Note } from "@/types";
import { useEffect, useState } from "react";
import { fetchAllContents } from "@/lib/api/notesApi";

export default function Page() {
  const router = useRouter();

const [notes, setNotes] = useState<Note[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const getNotes = async () => {
    try {
      const res = await fetchAllContents();
      setNotes(res.data);
    } catch (err) {
      setError("Failed to load notes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  getNotes();
}, []);

  const handleCreate = () => {
    router.push("/editor");
  };



  return (
    <main >
      <SiteHeader title="Notes" />
      <div className="flex flex-1 flex-col">
        {/* <div className="flex justify-end px-6 pt-4">
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div> */}
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 md:gap-6 md:p-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              notes.map((note) => <NoteCard key={note._id} note={note} />)
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
