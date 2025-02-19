import MainItems from "@/components/homeItems";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Home",
};

export default async function Home() {
  return <MainItems />;
}
