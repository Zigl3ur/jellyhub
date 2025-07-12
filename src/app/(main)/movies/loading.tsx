import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-20 max-w-7xl mx-auto px-4">
      <div className="w-full max-w-xs xs:max-w-sm md:max-w-xl self-center sticky top-2 z-10">
        <div className="relative">
          <Input className="bg-background" disabled={true} placeholder="Search for Movies" />
          <div className="absolute bg-secondary rounded-full right-2 top-1/2 -translate-y-1/2 p-1">
            <X className="h-4 w-4" />
          </div>
        </div>
      </div>
      <Loader />
    </div>
  );
}
