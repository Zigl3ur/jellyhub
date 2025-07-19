import "./globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { Metadata } from "next";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

// TODO: weird bug with metadata title where title is not set in loading.tsx
export const metadata: Metadata = {
  title: {
    template: "JellyHub - %s",
    default: "JellyHub",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        )}
      </head>
      <body className={`${roboto.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
