"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { itemJellyfin } from "@/types/jellyfin-api.types";
import { useState } from "react";

interface ItemCardProps {
  item: itemJellyfin;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [loaded, setLoaded] = useState<boolean>(false);

  const isMusic = item.item_type === "MusicAlbum";

  return (
    <Card
      className={`flex flex-col w-50 ${
        !isMusic && "h-[335px] justify-between"
      }`}
    >
      <CardContent className="flex items-center justify-center relative">
        <div
          className={`relative w-[150px] h-[${isMusic ? "150px" : "225px"}]`}
        >
          <Image
            className={`w-full ${
              isMusic ? "h-[150px]" : "h-full"
            } rounded-sm object-cover`}
            src={item.item_image}
            alt={item.item_name}
            height={isMusic ? 150 : 225}
            width={150}
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <Skeleton
              className={`w-full h-full rounded-sm absolute top-0 left-0`}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start w-full text-center">
        <CardTitle className="w-full truncate">{item.item_name}</CardTitle>
        <CardDescription className="truncate w-full text-center">
          {item.item_location.length} server
          {item.item_location.length > 1 && "s"}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
