
"use client";

import { SiteHeader } from "@/components/site-header"
import {   
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
 } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { PlusCircle, Edit } from "lucide-react"

import data from "../data.json"

export default function Page() {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/editor");
  };

  const handleEdit = (noteId: string) => {
    router.push(`/editor?id=${noteId}`);
  };

  return (
    <main>
     <SiteHeader title="Notes" />
    <div className="flex flex-1 flex-col">
   
      <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 md:gap-6 md:p-6">

          {data.map((note, idx) => (
      <Card className="w-full"   style={{ backgroundColor: note.hexColor }}
      key = {note.title}  >

       <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle>{note.title}</CardTitle>
            <CardDescription>Created on {note.date}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(String(note.id))}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {note.body}
      </CardContent>
       </Card>

          ))}

        </div>
      </div>
    </div>
    </main>
   
  )
}
