"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteEditor } from "@/components/note-editor";
import { useEffect, useState } from "react";
import { isColorDark } from "@/lib/utils";
import { fetchContentById, createContent } from "@/lib/api/notesApi"; 
import { Note } from "@/types";



export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("id");

  const [note, setNote] = useState<Note | null>(null);
  const [color, setColor] = useState<string>("#ffffff");
  const [loading, setLoading] = useState<boolean>(!!noteId);

useEffect(() => {
  const loadNote = async () => {
    if (noteId) {
      try {
        const res = await fetchContentById(noteId);
        const fetchedNote = res.data as Note;

        setNote(
         fetchedNote,
        );
        setColor(fetchedNote.hex_color ?? "#ffffff");
      } catch (error) {
        console.error("Failed to fetch note", error);
        router.back(); // Navigate back if note not found
      } finally {
        setLoading(false);
      }
    }
  };

  loadNote();
}, [noteId, router]);


  const isDark = isColorDark(color);



  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: color }}>
      <header className={`border-b ${isDark ? "border-white/20" : "border-black/10"}`}>
        <div className="flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className={`mr-2 ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isDark ? "text-white" : "text-black"}`} />
          </Button>

          <h1 className={`font-semibold text-lg ${isDark ? "text-white" : "text-black"}`}>
            {note ? "Edit Note" : "New Note"}
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <NoteEditor
          initialTitle={note?.title || ""}
          initialContent={note?.body.bodyContent || ""}
          initialColor={note?.hex_color || "#ffffff"}

          onColorChanged={setColor} 
          isUpdate={note ? true : false}



        />
      </main>
    </div>
  );
}
