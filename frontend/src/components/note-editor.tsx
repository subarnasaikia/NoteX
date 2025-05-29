"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { isColorDark } from "@/lib/utils";
import { createContent, updateContentById } from "@/lib/api/notesApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";


interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialColor?: string;
  onColorChanged?: (color: string) => void;
  isUpdate: boolean;

}



export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  initialColor = "#ffffff",
  onColorChanged,
  isUpdate = false,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [color, setColor] = useState(initialColor);

  const isDark = isColorDark(color);
  const textColor = isDark ? "text-white" : "text-black";
  const placeholderColor = isDark ? "placeholder-white/70" : "placeholder-black/50";

  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("id");
  const noteType = searchParams.get("type") || "docs";
  const parentFolderId = searchParams.get("parentFolderId") || null;


  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorChanged?.(newColor);
  };

const handleSave = async () => {
  if (!title.trim() || !content.trim()) {
    toast.error("Note title and content cannot be empty");
    return;
  }

  const payload = {
    title: title || "Untitled Note",
    hex_color: color,
    body: {
      type: noteType,
      bodyContent: content || "",
    },
    parentFolderId,
    tags: [],
  };

  try {
    await createContent(payload);
    router.back();
  } catch (error) {
    console.error("Failed to create note:", error);
    toast.error("Failed to create note. Please try again.");
  }
};

const handleUpdate =   async () => {
  if (!title.trim() || !content.trim()) {
    toast.error("Note title and content cannot be empty");
    return;
  }

  const payload = {
    title: title || "Untitled Note",
    hex_color: color,
    body: {
      type: noteType,
      bodyContent: content || "",
    },
    parentFolderId,
    tags: [],
  };

  try {
    await updateContentById(
     noteId ?? "", payload);
    router.back();
  } catch (error) {
    console.error("Failed to create note:", error);
    toast.error("Failed to create note. Please try again.");
  }
};



   
  const colorOptions = [
    "#ffffff",
    "#f8f9fa",
    "#ffe8e8",
    "#fff8e8",
    "#e8ffe8",
    "#e8f8ff",
    "#f8e8ff",
  ];

  return (
    <div
      className={`w-full h-screen flex flex-col ${textColor} bg-transparent`}
    >
      <div className="px-4 py-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className={`w-full text-sm md:text-base lg:text-lg font-bold border-none bg-transparent shadow-none focus-visible:ring-0 outline-none custom-input ${textColor}`}
          style={{ 
            "--placeholder-color": isDark ? "#ffffffb3" : "#00000080" 
          } as React.CSSProperties}
        />
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
        className={`text-base flex-1 w-full border-none bg-transparent shadow-none focus-visible:ring-0 focus:outline-none p-0 px-4  m-0 rounded-none resize-none custom-input ${textColor}`}
        style={{ "--placeholder-color": isDark ? "#ffffffb3" : "#00000080" } as React.CSSProperties}
      />

         <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 p-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          {colorOptions.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-6 h-6 rounded-full border ${
                color === c ? "ring-2 ring-offset-2 ring-black" : ""
              }`}
              style={{ backgroundColor: c }}
              onClick={() => handleColorChange(c)}
              aria-label={`Select color ${c}`}
            />
          ))}

          <div className="relative w-8 h-8">
            <div
              className="w-full h-full rounded-full border cursor-pointer"
              style={{ backgroundColor: color }}
              title="Pick custom color"
            />
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {/* {onCancel && ( */}
            <Button  className="text-black" onClick={() => router.back()}>
              Cancel
            </Button>
          {/* )} */}
          <Button onClick={ isUpdate ? handleUpdate : handleSave }>{isUpdate ? "Update" : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}
