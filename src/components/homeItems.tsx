"use client";

import { getAllItemsAction } from "@/app/(main)/fetchItems.action";
import ItemCard from "./itemCard";
import ServerStats from "./serversStats";
import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { AllItemsType } from "@/types/jellyfin.types";

export default function MainItems() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<{ count: string; allItems: AllItemsType }>();

  useEffect(() => {
    getAllItemsAction().then((result) => {
      setData({
        count: result?.count?.toString() as string,
        allItems: result?.allItems as AllItemsType,
      });
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="p-4">
      <ServerStats
        isLoading={isLoading}
        count={[
          data?.count || "0",
          Array.isArray(data?.allItems.movies)
            ? data.allItems.movies.length.toString()
            : "0",
          Array.isArray(data?.allItems.shows)
            ? data.allItems.shows.length.toString()
            : "0",
          Array.isArray(data?.allItems.musicAlbum)
            ? data.allItems.musicAlbum.length.toString()
            : "0",
        ]}
      />
      <div className="flex justify-center flex-wrap gap-4">
        {isLoading ? (
          <div className="flex flex-col flex-wrap justify-center items-center text-center">
            <LoaderCircle className="animate-spin" />
            <span>Fetching Data, please wait.</span>
          </div>
        ) : data ? (
          <>
            {Array.isArray(data?.allItems.movies) &&
              data.allItems.movies.map((item) => (
                <ItemCard
                  key={item.item_name}
                  href={`/item/${item.item_name}`}
                  title={item.item_name}
                  serverCount={item.server_url.length}
                  image={item.item_image}
                />
              ))}
            {Array.isArray(data?.allItems.shows) &&
              data.allItems.shows.map((item) => (
                <ItemCard
                  key={item.item_name}
                  href={`/item/${item.item_name}`}
                  title={item.item_name}
                  serverCount={item.server_url.length}
                  image={item.item_image}
                />
              ))}
            {Array.isArray(data?.allItems.musicAlbum) &&
              data.allItems.musicAlbum.map((item) => (
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
          <div className="flex flex-col flex-wrap justify-center items-center text-center">
            <span>No items found. Please add at least one server.</span>
          </div>
        )}
      </div>
    </div>
  );
}
