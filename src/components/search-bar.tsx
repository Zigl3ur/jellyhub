import { X } from "lucide-react";
import Button from "./ui/button";
import { Input, InputAddon } from "./ui/input";
import type { ServersItems } from "@/functions/jellyfin.functions";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import Fuse from "fuse.js";
import LoaderIcon from "./ui/loader-icon";

interface SearchBarProps {
  className?: string;
  placeholder: string;
  items: ServersItems;
  onSearch: (items: ServersItems) => void;
}

export default function SearchBar({
  className,
  placeholder,
  items,
  onSearch,
}: SearchBarProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const isSearching = search !== debouncedSearch && search.trim() !== "";

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ["Name", "AlbumArtist"],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [items]);

  useEffect(() => {
    if (search.trim() === "") onSearch(items);
  }, [search, items]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") return;
    const result = fuse.search(debouncedSearch).map((r) => r.item);
    onSearch(result);
  }, [debouncedSearch, fuse]);

  return (
    <Input
      className={className}
      placeholder={placeholder}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    >
      {search !== "" && (
        <InputAddon side="right">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setSearch("")}
          >
            {!isSearching ? <X /> : <LoaderIcon />}
          </Button>
        </InputAddon>
      )}
    </Input>
  );
}
