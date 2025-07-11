"use client";

import { itemJellyfin } from "@/types/jellyfin-api.types";
import { useState } from "react";
import ItemDialog from "./itemDialog";
import NoItemFound from "./noItemFound";
import { Input } from "./ui/input";

interface ContentPageProps {
  placeholder: string;
  data: itemJellyfin[];
}

export default function ContentPage({ placeholder, data }: ContentPageProps) {
  const [filtered, setFiltered] = useState(data);

  const handleSearch = (searchTerm: string) => {
    const filtered = data.filter((item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filtered);
  };

  return (
    <div className="flex flex-col space-y-4">
      <Input
        className="bg-background/50"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
      />
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
