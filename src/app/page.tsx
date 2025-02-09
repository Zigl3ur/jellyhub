import Image from "next/image";

type item = {
  title: string;
  image: string;
};

export default async function Home() {
  const items: item[] = [];

  const list = await fetch(
    "https://jellyfin.zakarum.xyz/Items?IncludeItemTypes=Movie&Recursive=true",
    {
      method: "GET",
      headers: {
        Authorization: "MediaBrowser Token=ed9e8c11c4e9415fa65f60eb931a16a9",
      },
    }
  );

  const data = await list.json();

  data.Items.forEach((item) => {
    items.push({
      title: item.Name,
      image:
        item.ImageTags.Primary === undefined
          ? ""
          : `https://jellyfin.zakarum.xyz/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}`,
    });
  });

  return (
    <div className="flex flex-wrap">
      {items.map((item, index) => (
        <Image
          key={index}
          src={item.image === "" ? "/none.jpg" : item.image}
          alt={item.title}
          width={345}
          height={194}
          style={{ width: "auto", height: "auto" }}
        />
      ))}
    </div>
  );
}
