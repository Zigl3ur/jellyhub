import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { itemJellyfin } from "@/types/jellyfin-api.types";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ItemCard from "./itemCard";

interface DialogProps {
  item: itemJellyfin;
}

export default function ItemDialog({ item }: DialogProps) {
  const specs = [
    {
      title: "type",
      value: item.item_type,
    },
    {
      title: "duration",
      value: item.item_duration,
    },
    {
      title: "artist",
      value: item.item_artist,
    },
    {
      title: "year",
      value: item.item_premier_date,
    },
    {
      title: "rating",
      value: item.item_rating,
    },
  ];

  const isMusic = item.item_type === "MusicAlbum";

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <ItemCard item={item} />
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <div className="flex flex-col sm:flex-row gap-4">
          <Image
            className={`${
              isMusic && "h-[150px] w-[150px]"
            } rounded-sm object-cover`}
            src={item.item_image}
            alt={item.item_name}
            height={item.item_type === "MusicAlbum" ? 150 : 225}
            width={200}
          />
          <div className="flex flex-col">
            <DialogTitle className="text-2xl mb-4">
              {item.item_name}
            </DialogTitle>
            {specs.map((spec) =>
              spec.value === "None" ||
              (spec.title === "duration" &&
                spec.value === "00:00:00") ? null : (
                <div className="inline-flex mb-2 w-full" key={spec.title}>
                  <p className="mr-2">{spec.title}</p>
                  <p className="rounded-sm bg-slate-700 p-0.5 text-sm max-w-fit">
                    {spec.value}
                  </p>
                </div>
              )
            )}
            <div className="mt-auto">
              <h3 className="font-semibold mb-2">Available on</h3>
              <div className="flex flex-col">
                {item.item_location.map((loc) => {
                  return (
                    <Link
                      href={`${loc.server_url}/web/#/details?id=${loc.item_id}&serverId=${loc.server_id}`}
                      key={loc.item_id}
                      className="italic text-blue-500 text-sm inline-flex hover:underline max-w-fit"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {loc.server_url.replace(/^https?:\/\//, "")}
                      <ArrowUpRight size={20} className="ml-1" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
