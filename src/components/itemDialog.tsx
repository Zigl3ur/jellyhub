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

export default function ItemDialog(DialogProps: {
  item: itemJellyfin;
  reduced: boolean;
  className?: string;
}) {
  const specs = [
    {
      title: "type",
      value: DialogProps.item.item_type,
    },
    {
      title: "artist",
      value: DialogProps.item.item_artist,
    },
    {
      title: "year",
      value: DialogProps.item.item_premier_date,
    },
    {
      title: "rating",
      value: DialogProps.item.item_rating,
    },
  ];

  return (
    <Dialog>
      <div>
        <DialogTrigger asChild>
          {/* make image as trigger too */}
          <button className={DialogProps.className}>
            {DialogProps.item.item_name}
          </button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-fit sm:max-w-[500px]">
        <div className="flex flex-col sm:flex-row gap-4">
          <Image
            className="rounded-md"
            src={DialogProps.item.item_image || "/placeholder.svg"}
            alt={DialogProps.item.item_name}
            width={175}
            height={DialogProps.reduced ? 150 : 225}
          />
          <div className="flex flex-col">
            <DialogTitle className="text-2xl mb-4">
              {DialogProps.item.item_name}
            </DialogTitle>
            {specs.map((spec) =>
              spec.value === "None" ? null : (
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
                {DialogProps.item.server_url.map((url) => {
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
