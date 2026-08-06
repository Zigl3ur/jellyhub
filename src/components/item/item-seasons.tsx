import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../ui/accordion";
import { getServerItems } from "@/functions/jellyfin.functions";

interface ItemSeasonsProps {
  serverUrl: string;
  item: NonNullable<Awaited<ReturnType<typeof getServerItems>>>[number];
}

export default function ItemSeasons({ serverUrl, item }: ItemSeasonsProps) {
  const { data, isPending, error, isError } = useQuery({
    queryFn: () =>
      getServerItems({
        data: {
          url: serverUrl,
          opts: {
            types: ["Season"],
            parentId: item.Id,
          },
        },
      }),
    queryKey: ["seasons", item.Id],
  });

  return (
    <div className="space-y-2">
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
