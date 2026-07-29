import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Button from "../ui/button";

export default function AddServerDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <Plus /> Add Server
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Jellyfin Server</DialogTitle>
          <DialogDescription>
            Configure a new Jellyfin server to aggregate medias from it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
