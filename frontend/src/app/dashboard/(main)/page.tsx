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
import {notes} from "../data";
import { NoteCard } from "@/components/note-card";
import { Note } from "@/types";

export default function Page() {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/editor");
  };

  const handleEdit = (noteId: string) => {
    router.push(`/editor?id=${noteId}`);
  };

  return (
    <main >
      <SiteHeader title="Notes" />
      <div className="flex flex-1 flex-col">
        <div className="flex justify-end px-6 pt-4">
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 md:gap-6 md:p-6">
            {(notes as Note[]).map((note) => {
          

              return (
                <NoteCard key={note._id} note={note} />

                // <Card
                //   key={note.id}
                //   className={`w-full rounded-2xl p-4 py-8 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] hover:-translate-y-1 ${textColor}`}
                //   style={{ backgroundColor: note.hexColor }}
                // >
                //   <CardHeader className="relative pb-2 ">
                //     <Button
                //       variant="ghost"
                //       size="icon"
                //       onClick={() => handleEdit(String(note.id))}
                //       className={`absolute top-2 right-2 hover:bg-black/10 ${
                //         isDark ? "text-white hover:text-white" : "text-black hover:text-black"
                //       }`}
                //     >
                //       <EllipsisVertical className="h-4 w-4" />
                //     </Button>
                //     <CardTitle className="truncate text-lg font-semibold  max-w-[180px]">
                //       {note.title}
                //     </CardTitle>
                //     <CardDescription className={`text-xs ${mutedText}`}>
                //       Created on {note.date}
                //     </CardDescription>
                //   </CardHeader>
                //   <CardContent className={`line-clamp-4  text-sm ${mutedText}`}>
                //     {note.body}
                //   </CardContent>
                // </Card>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
