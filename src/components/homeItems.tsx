"use client";

import { getAllItemsAction } from "@/app/(main)/fetchItems.action";
import ItemCard from "./itemCard";
import ServerStats from "./serversStats";
import { useState, useEffect } from "react";
import { LoaderCircle, X } from "lucide-react";
import { AllItemsType } from "@/types/jellyfin.types";
import Link from "next/link";

export default function MainItems() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<{
    serverCount: number;
    allItems: AllItemsType;
  }>({ serverCount: 0, allItems: { movies: [], shows: [], musicAlbum: [] } });

  useEffect(() => {
    getAllItemsAction().then((result) => {
      setData({
        serverCount: result?.serverCount ?? 0,
        allItems: result?.allItems ?? { movies: [], shows: [], musicAlbum: [] },
      });
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="p-4">
      <ServerStats
        isLoading={isLoading}
        count={[
          data.serverCount,
          data.allItems.movies.length,
          data.allItems.shows.length,
          data.allItems.musicAlbum.length,
        ]}
      />
      <div className="flex justify-center flex-wrap gap-4">
        {isLoading ? (
          <div className="flex flex-col flex-wrap justify-center items-center text-center min-h-[50vh]">
            <LoaderCircle className="animate-spin" />
            <span>Fetching Data, please wait.</span>
          </div>
        ) : data.serverCount !== 0 ? (
          <>
            {data.allItems.movies.map((item) => (
              <ItemCard
                key={item.item_name}
                href={`/item/${item.item_name}`}
                title={item.item_name}
                serverCount={item.server_url.length}
                image={item.item_image}
              />
            ))}
            {data.allItems.shows.map((item) => (
              <ItemCard
                key={item.item_name}
                href={`/item/${item.item_name}`}
                title={item.item_name}
                serverCount={item.server_url.length}
                image={item.item_image}
              />
            ))}
            {data.allItems.musicAlbum.map((item) => (
              <ItemCard
                key={item.item_name}
                href={`/item/${item.item_name}`}
                title={item.item_name}
                serverCount={item.server_url.length}
                image={item.item_image}
              />
            ))}
          </>
        ) : (
          <div className="flex flex-col flex-wrap justify-center items-center text-center min-h-[50vh]">
            <X />
            <span>No items found. Please add at least one server.</span>
            <Link
              href={"/settings"}
              className="hover:underline italic text-cyan-600"
            >
              Add a Server
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
