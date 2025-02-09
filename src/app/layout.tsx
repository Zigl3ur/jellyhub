import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";

import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "JellyHub - Home",
  description: "Hub for your Jellyfin Servers",
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
