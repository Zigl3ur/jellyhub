import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JellyHub - Not Found",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="font-bold text-2xl mb-2">404</h2>
        <p>Page not found</p>
        <Link className="text-blue-500 hover:underline italic" href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
