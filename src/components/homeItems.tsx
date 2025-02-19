"use client";

import { getAllItemsAction } from "@/app/(main)/fetchItems.action";
import ItemCard from "./itemCard";
import ServerStats from "./serversStats";
import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

export default function MainItems() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getAllItemsAction().then((result) => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="p-4">
      <ServerStats
        isLoading={isLoading}
        count={[
          data?.count as number,
          data?.allItems.movies.length as number,
          data?.allItems.shows.length as number,
          data?.allItems.musicAlbum.length as number,
        ]}
      />
      <div className="flex justify-center flex-wrap gap-4">
        {isLoading ? (
          <div className="flex flex-col flex-wrap justify-center items-center text-center">
            <LoaderCircle className="animate-spin" />
            <span>Fetching Data, please wait.</span>
          </div>
        ) : (
          data?.allItems.movies.map((item) => (
            <ItemCard
              key={item.item_name}
              href={`/item/${item.item_name}`}
              title={item.item_name}
              image={item.item_image}
            />
          ))
        )}
        {data?.allItems.shows.map((item) => (
          <ItemCard
            key={item.item_name}
            href={`/item/${item.item_name}`}
            title={item.item_name}
            image={item.item_image}
          />
        ))}
        {data?.allItems.musicAlbum.map((item) => (
          <ItemCard
            key={item.item_name}
            href={`/item/${item.item_name}`}
            title={item.item_name}
            image={item.item_image}
          />
        ))}
      </div>
    </div>
  );
}
