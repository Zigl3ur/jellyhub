import Image from "next/image";
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

export default function ItemCard(cardProps: {
  isLoading: boolean;
  title?: string;
  image?: string;
  alt?: string;
  serverCount?: number;
  href: string;
}) {
  return cardProps.isLoading ? (
    <Card className="justify-center bg-black/30 backdrop-blur-lg">
      <CardContent className="p-4">
        <Skeleton className="h-[225px] w-[150px] rounded-sm" />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-3 w-[80px] mt-2" />
      </CardFooter>
    </Card>
  ) : (
    <Card className="justify-center bg-black/30 backdrop-blur-lg">
      <CardContent className="p-4">
        <Link href={cardProps.href}>
          <Image
            className="items-center rounded-sm hover:scale-105 transition-transform"
            src={
              "https://jellyfin.zakarum.xyz/Items/74fbfb2ef85e2af796a84f951af08b88/Images/Primary?tag=cb0912fc5e6dc3a27cc2c591c9efcb79"
            }
            alt={"cardProps.alt"}
            width={150}
            height={225}
          />
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Link href={cardProps.href}>
          <CardTitle className="hover:underline">{cardProps.title}</CardTitle>
        </Link>
        <CardDescription>
          Found on {cardProps.serverCount} server(s)
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
