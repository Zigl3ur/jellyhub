import { Clapperboard, Cog, DiscAlbum, House, LogOut, Tv2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { AvatarFallback, AvatarImg, AvatarRoot } from "./ui/avatar";
import Skeleton from "./ui/skeleton";
import type { LinkProps } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { Link } from "@/components/ui/link";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  return (
    <header className="flex items-center h-11 justify-center">
      <DesktopNav />
      <MobileNav />
    </header>
  );
}

type DestinationEntry = {
  label: string;
  icon: ReactElement;
  to: LinkProps["to"];
};

const destinations = [
  {
    label: "Home",
    icon: <House className="size-4" strokeWidth={1.5} />,
    to: "/",
  },
  {
    label: "Movies",
    icon: <Clapperboard className="size-4" strokeWidth={1.5} />,
    to: "/movies",
  },
  {
    label: "Series",
    icon: <Tv2 className="size-4" strokeWidth={1.5} />,
    to: "/series",
  },
  {
    label: "Albums",
    icon: <DiscAlbum className="size-4" />,
    to: "/albums",
  },
] satisfies Array<DestinationEntry>;

function MobileNav() {
  return (
    <div className="bg-accent-foreground p-1.5 gap-2 rounded inlinde sm:hidden flex items-center h-full justify-between w-full">
      <AppNav />
      <UserNav />
    </div>
  );
}

function DesktopNav() {
  return (
    <div className="hidden sm:flex sm:w-full">
      <div className="flex-1" />
      <div className="bg-accent-foreground p-1.5 rounded">
        <AppNav />
      </div>
      <div className="flex-1 flex justify-end">
        <div className="bg-accent-foreground p-1.5 rounded">
          <UserNav />
        </div>
      </div>
    </div>
  );
}

function AppNav() {
  return (
    <nav className="flex gap-2 items-center h-full">
      {destinations.map((d) => (
        <Link key={d.to} to={d.to} variant="outline" className="h-full">
          {d.icon}
          <span className="hidden sm:block">{d.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function UserNav() {
  const navigate = useNavigate();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => navigate({ to: "/login" }),
      },
    });
  };

  return (
    <nav className="flex gap-2">
      <Link to="/settings" variant="outline">
        <Cog className="size-4.5" strokeWidth={1.5} />
      </Link>
      <button
        onClick={() => signOut()}
        className="px-1.5 flex gap-1 items-center hover:cursor-pointer text-sm py-1 rounded-lg transition-colors duration-200 hover:bg-accent"
      >
        <LogOut className="size-4.5" strokeWidth={1.5} />
      </button>
      {isPending ? (
        <Skeleton className="size-8" />
      ) : (
        <AvatarRoot>
          <AvatarImg src={user?.image as string} width={50} height={50} />
          <AvatarFallback delay={500}>
            {user?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </AvatarRoot>
      )}
    </nav>
  );
}
