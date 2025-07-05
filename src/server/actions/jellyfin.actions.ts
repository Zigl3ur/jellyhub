"use server";

import { prisma } from "../../lib/prisma";
import { getUser } from "../utils";
import { jellydataDisplayed, ServerActionReturn } from "@/types/actions.types";


// export async function getAllServerItems(): Promise<
//   ServerActionReturn<{
//     movies: Array<itemJellyfin>;
//     series: Array<itemJellyfin>;
//     musicAlbum: Array<itemJellyfin>;
//   }>
// > {
//   const user = await getUser();

//   const list = await prisma.jellydata.findMany({
//     where: { userId: user.id },
//   });

//   const items = await Promise.all(
//     list.map(async (jellydata) => {
//       return await getAllItems(
//         jellydata.serverUrl,
//         decryptToken(jellydata.serverToken)
//       );
//     })
//   );

//   return {
//     success: true,
//     data: undefined,
//   };
// }
