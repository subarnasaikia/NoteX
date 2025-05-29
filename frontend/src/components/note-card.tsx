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
import { isColorDark, formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteContentById } from "@/lib/api/notesApi";
import { toast } from "sonner";

export function NoteCard({ note }: { note: Note }) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const isDark = isColorDark(note.hex_color);
  const textColor = isDark ? "text-white" : "text-black";
  const mutedText = isDark ? "text-white/70" : "text-black/60";

  const handleEdit = () => {
    router.push(
      `/editor?id=${note._id}&type=${note.body.type}&parentFolderId=${note.parentFolderId || ""}`
    );
  };

  const handleDelete = async () => {
    try {
      await deleteContentById(note._id);
      setOpenDialog(false);
      location.reload();
  
    } catch (error) {
      toast.error("Failed to delete note. Please try again.");
    }
  };

  return (
    <>
      <Card
        key={note._id}
        className={`w-full h-56 flex flex-col justify-between rounded-2xl p-4 py-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] hover:-translate-y-1 ${textColor}`}
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
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-red-500">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CardTitle className="truncate text-lg font-semibold max-w-[180px]">
            {note.title}
          </CardTitle>
          <CardDescription className={`text-xs ${mutedText}`}>
            Created on {formatDate(note.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className={`line-clamp-4 text-sm ${mutedText}`}>
          {note.body.bodyContent}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this note? This action cannot be undone.</p>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
