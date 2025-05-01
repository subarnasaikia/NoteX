
import { SiteHeader } from "@/components/site-header"
import {   
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
 } from "@/components/ui/card"


import data from "../data.json"

export default function Page() {
  return (
    <main>
     <SiteHeader title="Notes" />
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 py-2 md:gap-3 md:py-3">

          {data.map((note, idx) => (
      <Card className="w-[350px]"   style={{ backgroundColor: note.hexColor }}
      key = {note.title}  >

       <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>Created on {note.date}</CardDescription>
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
