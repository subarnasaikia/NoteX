"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Folder } from "lucide-react";
import { isColorDark } from "@/lib/utils";
import { fetchFoldersWithPagination, fetchRootContents } from "@/lib/api/foldersApi";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Note, FolderData } from "@/types";

export default function Page() {
  const router = useRouter();
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>("root");


  const loadFolders = async (currentPage: number) => {
    try {
      const res = await fetchFoldersWithPagination({ page: currentPage, limit });
      if (res.success) {
        setFolders((prev) => [...prev, ...res.data.folders]);
        setHasMore(res.data.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch folders:", err);
    }
  };

  useEffect(() => {
    loadFolders(page);
  }, [page]);

useEffect(() => {
  const loadRootNotes = async () => {
    try {
      const res = await fetchRootContents();
      if (res.success) {
        const fetchedNotes = res.data.contents;

        setNotes((prevNotes) => {
          const map = new Map<string, Note>();
          [...prevNotes, ...fetchedNotes].forEach((note) => map.set(note._id, note));
          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.error("Failed to fetch root folder notes", err);
    }
  };

  loadRootNotes();
}, []);



  const handleCreate = () => router.push("/editor");
  const handleEdit = (noteId: string) => router.push(`/editor?id=${noteId}`);

  const lastFolderRef = useInfiniteScroll(hasMore, () => setPage((p) => p + 1));

  return (
    <main className="flex flex-col min-h-screen">
      <SiteHeader title="Notes" />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-48 border-r bg-muted p-4">
          <div className="mb-4 text-sm font-semibold text-muted-foreground">Folders</div>
          <ul className="space-y-1">
            {/* Root Folder */}
         <li
  key="root"
  className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm cursor-pointer hover:bg-muted-foreground/10 ${
    selectedFolderId === "root" ? "bg-muted-foreground/20 font-semibold" : ""
  }`}
  onClick={() => setSelectedFolderId("root")}
>
  <Folder className="h-4 w-4" />
  /
</li>

{folders.map((folder, index) => {
  const isLast = index === folders.length - 1;
  const isSelected = selectedFolderId === folder._id;

  return (
    <li
      key={folder._id}
      ref={isLast ? lastFolderRef : null}
      className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm cursor-pointer hover:bg-muted-foreground/10 ${
        isSelected ? "bg-muted-foreground/20 font-semibold" : ""
      }`}
      onClick={() => setSelectedFolderId(folder._id)}
    >
      <Folder className="h-4 w-4" />
      {folder.folderName}
    </li>
  );
})}

          </ul>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <div className="flex justify-end px-6 pt-4">
            <Button onClick={handleCreate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>

          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 md:gap-6 md:p-6">
              {notes.map((note) => {
                const isDark = isColorDark(note.hex_color);
                const textColor = isDark ? "text-white" : "text-black";
                const mutedText = isDark ? "text-white/70" : "text-black/60";

                return (
                  <Card
                    key={note._id}
                    className={`w-full rounded-2xl p-4 py-8 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] hover:-translate-y-1 ${textColor}`}
                    style={{ backgroundColor: note.hex_color }}
                  >
                    <CardHeader className="relative pb-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(String(note._id))}
                        className={`absolute top-2 right-2 hover:bg-black/10 ${
                          isDark ? "text-white hover:text-white" : "text-black hover:text-black"
                        }`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
