import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { itemJellyfin } from "@/types/jellyfin.types";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DialogProps {
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

  return (
    <Dialog>
      <div>
        <DialogTrigger asChild>
          {/*TODO: make image as trigger too */}
          <button className={Props.className}>{Props.item.item_name}</button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-fit sm:max-w-[500px]">
        <div className="flex flex-col sm:flex-row gap-4">
          <Image
            className="rounded-md object-cover"
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
                {Props.item.server_url.map((url) => {
                  return (
                    <Link
                      href={url}
                      key={url}
                      className="italic text-blue-500 text-sm inline-flex hover:underline max-w-fit"
                    >
                      {url}
                      <ArrowUpRight size={20} />
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
