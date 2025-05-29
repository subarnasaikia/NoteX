"use client"; 

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { Note } from "@/types";
import { isColorDark } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";

export function NoteCard({ note }: { note: Note }) {
  const router = useRouter();

  const isDark = isColorDark(note.hex_color);
  const textColor = isDark ? "text-white" : "text-black";
  const mutedText = isDark ? "text-white/70" : "text-black/60";

  const handleEdit = (noteId: string) => {
    router.push(`/editor?id=${noteId}`);
  };

  const handleDelete = (noteId: string) => {
    // You can implement the actual delete logic here
    // e.g., call a delete API and refresh the list
  };

  return (
    <Card
      key={note._id}
      className={`w-full rounded-2xl p-4 py-8 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] hover:-translate-y-1 ${textColor}`}
      style={{ backgroundColor: note.hex_color }}
    >
      <CardHeader className="relative pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 hover:bg-black/10 ${
                isDark ? "text-white hover:text-white" : "text-black hover:text-black"
              }`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50">
            <DropdownMenuItem onClick={() => handleEdit(String(note._id))}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(String(note._id))}>
              <Trash className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CardTitle className="truncate text-lg font-semibold max-w-[180px]">
          {note.title}
        </CardTitle>
        <CardDescription className={`text-xs ${mutedText}`}>
          Created on {note.createdAt}
        </CardDescription>
      </CardHeader>
      <CardContent className={`line-clamp-4 text-sm ${mutedText}`}>
        {note.body.bodyContent}
      </CardContent>
    </Card>
  );
}
