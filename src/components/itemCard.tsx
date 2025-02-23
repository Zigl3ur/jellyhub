"use client";

import Image from "next/image";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import ItemDialog from "@/components/itemDialog";
import { itemJellyfin } from "@/types/jellyfin.types";

export default function ItemCard(cardProps: {
  reduced: boolean;
  item: itemJellyfin;
  serverCount?: number;
}) {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <Card className="bg-black/30 backdrop-blur-lg w-[175px] h-full flex flex-col">
      <CardContent className="p-4 flex-grow flex items-center justify-center">
        <div
          className={`relative w-[175px] ${
            cardProps.reduced ? "h-[150px]" : "h-[225px]"
          }`}
        >
          <Image
            className="rounded-sm hover:scale-105 transition-transform object-cover w-full h-full"
            src={cardProps.item.item_image || "/default.svg"}
            alt={cardProps.item.item_name || ""}
            fill
            sizes="175px"
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <Skeleton className="w-full h-full rounded-sm absolute inset-0" />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start w-full">
        <CardTitle className="w-full">
          <ItemDialog
            item={cardProps.item}
            reduced={cardProps.reduced}
            className="hover:underline truncate w-full"
          />
        </CardTitle>
        <CardDescription className="truncate w-full">
          Found on {cardProps.serverCount} server(s)
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
