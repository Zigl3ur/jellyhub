import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-20 max-w-12xl mx-auto">
      <Input
        className="bg-background/50 max-w-xl self-center"
        placeholder={"Search for Movies"}
        disabled={true}
      />
      <Loader />
    </div>
  );
}
