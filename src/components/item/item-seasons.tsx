import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../ui/accordion";
import type { ServersItems } from "@/functions/jellyfin.functions";
import { getServerItems } from "@/functions/jellyfin.functions";

interface ItemSeasonsProps {
  item: ServersItems[number];
}

export default function ItemSeasons({ item }: ItemSeasonsProps) {
  const { data, isPending, error, isError } = useQuery({
    queryFn: () =>
      getServerItems({
        data: {
          url: item.Servers[0].url,
          opts: {
            types: ["Season"],
            parentId: item.Id,
          },
        },
      }),
    queryKey: ["seasons", item.Id],
  });

  return (
    <div className="space-y-1">
      <h6 className="opacity-75">Seasons</h6>

      <Accordion>
        {data?.map((i) => (
          <AccordionItem key={i.Id}>
            <AccordionHeader>
              <AccordionTrigger>{i.Name}</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>aaa</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
