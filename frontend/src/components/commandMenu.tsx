"use client";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // spinner icon
import { searchContent } from "@/lib/api/notesApi";

type SearchResult = {
  _id: string;
  title: string;
  parentFolderId: string | null;
};

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // open dialog on Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  // fetch results when query changes
  useEffect(() => {
    const fetchData = async () => {
      if (query.trim().length < 2) return;
      setLoading(true);
      try {
        const res = await searchContent({query});

        // const data = await res.json();
        setResults(res.data || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchData, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search your notes, flashcards, or content..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <CommandEmpty>No results found.</CommandEmpty>
        {!loading && (
          <CommandGroup heading="Search Results">
            {results.map((item) => (
              <CommandItem
                key={item._id}
                onSelect={() => {
                  router.push(
                    `/editor?id=${item._id}&type=markdown&parentFolderId=${item.parentFolderId ?? ""}`
                  );
                  setOpen(false);
                }}
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
