import { JellyfinIcon } from "../ui/jellyfin-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { ItemServerData } from "@/types";

interface ItemSelectServerProps {
  servers: Array<ItemServerData>;
  defaultValue: ItemServerData;
  onSelect: (server: ItemServerData) => void;
}

export default function ItemSelectServer({
  servers,
  defaultValue,
  onSelect,
}: ItemSelectServerProps) {
  return (
    <Select
      defaultValue={defaultValue}
      itemToStringLabel={(item) => item.name}
      onValueChange={(value) => onSelect(value as ItemServerData)}
    >
      <SelectTrigger className="h-7">
        <SelectValue placeholder="Select Server">
          {(server: ItemServerData) => (
            <span className="flex items-center gap-1.5">
              <JellyfinIcon className="size-3.5" />
              {server.name}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {servers.map((s) => (
          <SelectItem
            key={s.id}
            value={s}
            className="flex gap-1.5 items-center"
          >
            <JellyfinIcon className="size-3.5" /> {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
