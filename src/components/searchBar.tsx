"use client";

import { itemJellyfin } from "@/types/jellyfin-api.types";
import { Input } from "./ui/input";
import { useState } from "react";
import ItemDialog from "./global/itemDialog";

interface SearchBarProps {
  type: "Movie" | "Series" | "MusicAlbum" | "...";
  items: itemJellyfin[];
}

export default function SearchBar(Props: SearchBarProps) {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Input
        className="bg-background/50"
        placeholder={`Search for ${Props.type}`}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="relative flex flex-col w-full mt-2">
        {search.length > 0 && (
          <div
            className="absolute left-0 right-0
           bg-background/85 z-10 max-h-[25rem] overflow-y-auto space-y-1 rounded-md"
          >
            {Props.items
              .filter((item) =>
                item.item_name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <ItemDialog
                  key={item.item_name}
                  type="title"
                  item={item}
                  className="flex items-center w-full p-2 rounded-md hover:bg-blue-800/20"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
