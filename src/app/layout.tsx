import "./globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Need to hardcode head title cause got a weird bug with next metadata that was not showing when loading ui was displayed */}
        <title>JellyHub</title>
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
