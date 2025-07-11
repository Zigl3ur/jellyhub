import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";

export default function Loading() {
  return (
    <div className="space-y-20">
      <Input
        className="bg-background/50"
        placeholder={"Search for Movies"}
        disabled={true}
      />
      <Loader />
    </div>
  );
}
