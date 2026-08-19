import {
  ClientOnly,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import type { RouterContext } from "@/router";
import "./globals.css";

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Jellyhub" },
    ],
    scripts: [
      process.env.NODE_ENV === "development"
        ? {
            crossOrigin: "anonymous",
            src: "//unpkg.com/react-scan/dist/auto.global.js",
          }
        : {},
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="root max-w-[160rem] mx-auto">
        <Outlet />
        <Scripts />
        {process.env.NODE_ENV === "development" && (
          <ClientOnly>
            <TanStackDevtools
              plugins={[
                { name: "TanStack Query", render: <ReactQueryDevtoolsPanel /> },
                {
                  name: "TanStack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </ClientOnly>
        )}
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="font-bold text-2xl mb-2">404</h2>
        <p>Page not found</p>
        <Link className="text-blue-500 hover:underline italic" to="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
