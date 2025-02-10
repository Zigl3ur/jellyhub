import ServerForm from "@/components/forms/serverForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Dashboard",
};

export default function Dashboard() {
  return (
    <div className="">
      <ServerForm />
    </div>
  );
}
