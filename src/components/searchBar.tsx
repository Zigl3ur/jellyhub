"use client";

import { itemJellyfin } from "@/types/jellyfin.types";
import { Input } from "./ui/input";
import { useState } from "react";
import ItemDialog from "./itemDialog";

interface SearchBarProps {
  serverCount: number;
  type: "Movie" | "Series" | "MusicAlbum" | "...";
  items: itemJellyfin[];
}

export default function SearchBar(Props: SearchBarProps) {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Input
        className="bg-black/30 backdrop-blur-lg"
        placeholder={`Search for ${Props.type}`}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-col w-full mt-2">
        {search.length > 0 && (
          <div className="relative w-full bg-background backdrop-blur-lg z-10 max-h-[25rem] overflow-y-auto space-y-1 rounded-md">
            {Props.items
              .filter((item) =>
                item.item_name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.item_name}
                  className="rounded-md hover:bg-blue-800/20"
                >
                  <ItemDialog
                    item={item}
                    className="flex p-2 w-full text-wrap"
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
