import { Clapperboard, Cog, DiscAlbum, House, LogOut, Tv2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { AvatarFallback, AvatarImg, AvatarRoot } from "./ui/avatar";
import Logo from "./logo";
import type { LinkProps } from "@tanstack/react-router";
import type { ReactElement } from "react";
import Link from "@/components/ui/link";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  return (
    <header className="flex items-center h-11">
      <div className="flex-1" />
      <AppNav />
      <div className="flex-1 flex justify-end">
        <UserNav />
      </div>
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
  { label: "Albums", icon: <DiscAlbum className="size-4" />, to: "/albums" },
] satisfies Array<DestinationEntry>;

function AppNav() {
  return (
    <nav className="flex gap-2 p-1.5 bg-accent-foreground rounded-lg items-center">
      {destinations.map((d) => (
        <Link
          key={d.to}
          to={d.to}
          className="px-1.5 flex gap-2 items-center py-1 data-[status='active']:bg-primary rounded-lg transition-colors duration-200 data-[status='active']:text-accent-foreground not-data-[status='active']:hover:bg-accent"
        >
          {d.icon}
          {d.label}
        </Link>
      ))}
    </nav>
  );
}

function UserNav() {
  const navigate = useNavigate();

  const { data: session, isPending, error } = authClient.useSession();
  const user = session?.user;

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => navigate({ to: "/login" }),
      },
    });
  };

  return (
    <nav className="flex gap-2 p-1.5 bg-accent-foreground rounded-lg">
      <Link to="/settings" className="flex gap-2 items-center text-sm">
        <Cog className="size-4.5" strokeWidth={1.5} />
      </Link>
      <button
        onClick={() => signOut()}
        className="px-1.5 flex gap-1 items-center hover:cursor-pointer text-sm py-1 rounded-lg transition-colors duration-200 hover:bg-accent"
      >
        <LogOut className="size-4.5" strokeWidth={1.5} />
      </button>
      <AvatarRoot>
        <AvatarImg src={user?.image as string} width={50} height={50} />
        <AvatarFallback delay={500}>
          {user?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </AvatarRoot>
    </nav>
  );
}
