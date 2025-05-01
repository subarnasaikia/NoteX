"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NoteEditor } from "@/components/note-editor";

import data from "../dashboard/data.json";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const noteId = searchParams.get("id");
  
  // Find note if editing an existing note
  const existingNote = noteId 
    ? data.find((note) => String(note.id) === noteId) 
    : null;

  const handleSave = (note: { title: string; content: string; color: string }) => {
    // Here you would save the note to your backend/database
    console.log("Saving note:", note);
    
    // For now, just navigate back to dashboard
    router.push("/dashboard");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center px-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold text-lg">
            {existingNote ? "Edit Note" : "New Note"}
          </h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-6">
          <NoteEditor
            initialTitle={existingNote?.title || ""}
            initialContent={existingNote?.body || ""}
            initialColor={existingNote?.hexColor || "#ffffff"}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </main>
    </div>
  );
}