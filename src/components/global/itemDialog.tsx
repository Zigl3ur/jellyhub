"use client";

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
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from "../ui/card";

interface DialogProps {
  reduced?: boolean;
  item: itemJellyfin;
  className?: string;
}

export default function ItemDialog(Props: DialogProps) {
  const specs = [
    {
      title: "type",
      value: Props.item.item_type,
    },
    {
      title: "duration",
      value: Props.item.item_duration,
    },
    {
      title: "artist",
      value: Props.item.item_artist,
    },
    {
      title: "year",
      value: Props.item.item_premier_date,
    },
    {
      title: "rating",
      value: Props.item.item_rating,
    },
  ];

  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <Dialog>
      <div>
        <DialogTrigger asChild className="cursor-pointer">
          <Card className="flex flex-col w-50">
            <CardContent className="flex items-center justify-center">
              <div
                className={`relative w-[175px] ${
                  Props.reduced ? "h-[150px]" : "h-[225px]"
                }`}
              >
                <Image
                  className="rounded-sm object-cover w-full h-full"
                  src={Props.item.item_image || "/default.svg"}
                  alt={Props.item.item_name || ""}
                  fill
                  sizes="175px"
                  onLoad={() => setLoaded(true)}
                />
                {!loaded && (
                  <Skeleton className="w-full h-full rounded-sm absolute inset-0" />
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start w-full text-center">
              <CardTitle className="w-full truncate">
                {Props.item.item_name}
              </CardTitle>
              <CardDescription className="truncate w-full text-center">
                {Props.item.item_location.length ?? 0} server
                {Props.item.item_location.length &&
                Props.item.item_location.length > 1
                  ? "s"
                  : ""}
              </CardDescription>
            </CardFooter>
          </Card>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-fit">
        <div className="flex flex-col sm:flex-row gap-4">
          <Image
            className="rounded-md object-cover h-fit"
            src={Props.item.item_image || "/placeholder.svg"}
            alt={Props.item.item_name}
            width={200}
            height={300}
          />
          <div className="flex flex-col">
            <DialogTitle className="text-2xl mb-4">
              {Props.item.item_name}
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
                {Props.item.item_location.map((loc) => {
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
