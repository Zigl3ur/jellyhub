"use client";

import { itemJellyfin } from "@/types/jellyfin-api.types";
import { useState, useCallback, useMemo } from "react";
import ItemDialog from "./itemDialog";
import NoItemFound from "./noItemFound";
import { Input } from "./ui/input";
import { debounce } from "@/lib/utils";

interface ContentPageProps {
  placeholder: string;
  data: itemJellyfin[];
}

export default function ContentPage({ placeholder, data }: ContentPageProps) {
  const [filtered, setFiltered] = useState(data);

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
    <div className="flex flex-col space-y-4 max-w-12xl mx-auto">
      <Input
        className="bg-background/50 max-w-xl self-center"
        placeholder={placeholder}
        onChange={(e) => debouncedSearch(e.target.value)}
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
