import { LoaderCircle } from "lucide-react";

export default function ItemsLoader() {
  return (
    <div className="flex flex-col flex-wrap justify-center items-center text-center min-h-[50vh]">
      <LoaderCircle className="animate-spin" />
      <span>Fetching Data, please wait.</span>
    </div>
  );
}
