import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import appCss from "./globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Jellyhub" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
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
      <body className="root">
        <Outlet />
        <Scripts />
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
