import "./globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

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
