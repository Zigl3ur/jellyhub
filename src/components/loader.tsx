import { LoaderCircle } from "lucide-react";

export default function ItemsLoader() {
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-3/4 space-y-2">
      <LoaderCircle className="animate-spin" />
      <span>Fetching Data, please wait.</span>
    </div>
  );
}
