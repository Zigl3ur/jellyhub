import { X } from "lucide-react";
import Link from "next/link";

export default function NoItemFound() {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <X />
      <span>No items found.</span>
      <span>Please add at least one server / Check servers status </span>
      <Link href={"/settings"} className="hover:underline italic text-cyan-600">
        Go to Settings
      </Link>
    </div>
  );
}
