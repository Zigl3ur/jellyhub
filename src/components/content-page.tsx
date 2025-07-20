"use client";

import { itemJellyfin } from "@/types/jellyfin-api.types";
import { useState, useCallback, useMemo, useRef } from "react";
import ItemDialog from "./item-dialog";
import NoItemFound from "./no-item-found";
import { Input } from "./ui/input";
import { debounce } from "@/lib/utils";
import { X } from "lucide-react";

interface ContentPageProps {
  placeholder: string;
  data: itemJellyfin[];
}

/**
 * The content of a page where we display items like movies, series and albums
 * @param Props take a placeholder for the search bar and the data that is the items to display
 */
export default function ContentPage({ placeholder, data }: ContentPageProps) {
  const [filtered, setFiltered] = useState(data);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const filtered = data.filter((item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFiltered(filtered);
    },
    [data]
  );

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 200),
    [handleSearch]
  );

  return (
    <div className="flex flex-col space-y-4 max-w-[2000px] mx-auto px-4">
      {/* depending on browser content move when not scrollable cause of native scrollbar (chromium) */}
      <div className="w-full max-w-xs xs:max-w-sm md:max-w-xl self-center sticky top-2 z-10">
        <div className="relative">
          <Input
            className="bg-background"
            ref={inputRef}
            placeholder={placeholder}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <div
            className="absolute bg-secondary rounded-full right-2 top-1/2 -translate-y-1/2 p-1"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = "";
                handleSearch("");
              }
            }}
          >
            <X className="h-4 w-4" />
          </div>
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {filtered.map((item) => (
            <ItemDialog key={item.item_name} item={item} />
          ))}
        </div>
      ) : (
        <NoItemFound />
      )}
    </div>
  );
}
