"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialColor?: string;
  onSave?: (note: { title: string; content: string; color: string }) => void;
  onCancel?: () => void;
}

export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  initialColor = "#ffffff",
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [color, setColor] = useState(initialColor);

  const handleSave = () => {
    if (onSave) {
      onSave({
        title,
        content,
        color,
      });
    }
  };

  const colorOptions = [
    "#ffffff", // White
    "#f8f9fa", // Light gray
    "#ffe8e8", // Light red
    "#fff8e8", // Light yellow
    "#e8ffe8", // Light green
    "#e8f8ff", // Light blue
    "#f8e8ff", // Light purple
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto" style={{ backgroundColor: color }}>
      <CardHeader>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-xl font-bold border-none bg-transparent focus-visible:ring-0 px-0"
        />
      </CardHeader>
      <CardContent>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          className="w-full min-h-[200px] text-base bg-transparent border-none resize-none focus:outline-none"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`w-6 h-6 rounded-full border ${
                color === colorOption ? "ring-2 ring-offset-2 ring-black" : ""
              }`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
              aria-label={`Set note color to ${colorOption}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave}>Save</Button>
        </div>
      </CardFooter>
    </Card>
  );
}