"use client";

import Image from "next/image";
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function ItemCard(cardProps: {
  title?: string;
  image?: string;
  alt?: string;
  serverCount?: number;
  href: string;
}) {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <Card className="bg-black/30 backdrop-blur-lg w-[175px] h-full flex flex-col">
      <CardContent className="p-4 flex-grow flex items-center justify-center">
        <Link href={cardProps.href} className="w-full flex justify-center">
          <div className="relative w-[150px] h-[225px]">
            <Image
              className={
                "rounded-sm hover:scale-105 transition-transform object-cover w-full h-full"
              }
              src={cardProps.image || "/default.svg"}
              alt={cardProps.alt || cardProps.title || ""}
              fill
              onLoad={() => setLoaded(true)}
            />
            {!loaded && (
              <Skeleton className="w-full h-full rounded-sm absolute inset-0" />
            )}
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col items-start w-full">
        <Link href={cardProps.href} className="w-full">
          <CardTitle className="hover:underline truncate max-w-full">
            {cardProps.title}
          </CardTitle>
        </Link>
        <CardDescription className="truncate max-w-full">
          Found on {cardProps.serverCount} server(s)
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
