"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteEditor } from "@/components/note-editor";
import data from "../dashboard/data.json";
import { useState } from "react";
import { isColorDark } from "@/lib/utils";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("id");


  const existingNote = noteId
    ? data.find((note) => String(note.id) === noteId)
    : null;

  const handleSave = (note: { title: string; content: string; }) => {
    console.log("Saving note:", note);
    router.push("/dashboard");
  };

    const [color, setColor] = useState(existingNote?.hexColor ?? "#ffffff");
    const isDark = isColorDark(color);


  return (
    <div className="h-screen flex flex-col " style={{ backgroundColor: color }}>
<header className={`border-b ${isDark ? "border-white/20" : "border-black/10"}`}>
        <div className="flex h-14 items-center px-4">
       <Button
  variant="ghost"
  size="icon"
  onClick={() => router.push("/dashboard")}
 className={`mr-2 ${
    isDark
      ? "hover:bg-gray-800"
      : "hover:bg-gray-100"
  }`}>
  <ArrowLeft
    className={`h-4 w-4 ${isDark ? "text-white" : "text-black"}`}
  />
</Button>


          <h1   className={`font-semibold text-lg ${isDark ? "text-white" : "text-black"}`}>
            {existingNote ? "Edit Note" : "New Note"}
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto ">
        <NoteEditor
          initialTitle={existingNote?.title || ""}
          initialContent={existingNote?.body || ""}
          initialColor={existingNote?.hexColor || "#ffffff"}
          onSave={handleSave}
          onColorChanged={setColor}
          onCancel={() => router.push("/dashboard")}
        />
      </main>
    </div>
  );
}
