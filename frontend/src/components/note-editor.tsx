"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { isColorDark } from "@/lib/utils";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialColor?: string;
  onColorChanged?: (color: string) => void;
  onSave?: (note: { title: string; content: string; color: string }) => void;
  onCancel?: () => void;
}



export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  initialColor = "#ffffff",
  onColorChanged,
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [color, setColor] = useState(initialColor);

  const isDark = isColorDark(color);
  const textColor = isDark ? "text-white" : "text-black";
  const placeholderColor = isDark ? "placeholder-white/70" : "placeholder-black/50";

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorChanged?.(newColor);
  };

  const handleSave = () => {
    onSave?.({ title, content, color });
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
          className={`w-full text-4xl font-bold border-none bg-transparent shadow-none focus-visible:ring-0 outline-none custom-input ${textColor}`}
          style={{ 
            fontSize: '1rem',
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
          {onCancel && (
            <Button variant="outline" className="text-black" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}
