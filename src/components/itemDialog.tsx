"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { itemJellyfin } from "@/types/jellyfin-api.types";
import Image from "next/image";
import Link from "next/link";
import ItemCard from "./itemCard";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface DialogProps {
  item: itemJellyfin;
}

export default function ItemDialog({ item }: DialogProps) {
  const [loaded, setLoaded] = useState<boolean>(false);

  const specs = [
    {
      title: "Artist",
      value: item.item_artist,
    },
    {
      title: "Year",
      value: item.item_premier_date,
    },
    {
      title: "Duration",
      value: item.item_duration,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <ItemCard item={item} />
      </DialogTrigger>
      <DialogDescription />
      <DialogContent className="flex flex-col gap-6 max-h-[90vh] max-w-4xl overflow-y-auto p-6">
        <div className="relative shrink-0 self-center">
          <Image
            className="rounded-lg object-cover"
            src={item.item_image}
            alt={item.item_name}
            height={300}
            width={item.item_type === "MusicAlbum" ? 300 : 250}
            onLoad={() => setLoaded(true)}
          />
          {!loaded && <Skeleton className="absolute inset-0 rounded-lg" />}
        </div>
        <div className="flex flex-col justify-between min-h-0 flex-1 space-y-4">
          <DialogTitle className="text-3xl font-bold text-center mb-3">
            {item.item_name}
          </DialogTitle>

          <Separator className="opacity-50" />

          <div className="flex gap-3 justify-center">
            {specs.map(
              (spec) =>
                spec.value !== "None" &&
                spec.value !== "00h00m" &&
                spec.value !== undefined && (
                  <span
                    key={spec.title}
                    className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm font-medium"
                  >
                    {spec.value}
                  </span>
                )
            )}
          </div>
          <Separator className="opacity-50" />

          <div>
            <h3 className="font-semibold text-lg mb-3 text-center">
              Available on
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {item.item_location.map((loc) => (
                <Link
                  href={`${loc.server_url}/web/#/details?id=${loc.item_id}&serverId=${loc.server_id}`}
                  key={loc.item_id}
                  className="inline-flex items-center text-blue-500 hover:underline text-sm font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {loc.server_url.replace(/^https?:\/\//, "")}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
