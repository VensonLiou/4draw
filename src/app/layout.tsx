import Providers from "@/providers/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../css/globals.css";
import "../css/reset.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "4 Draw",
  description: "4 Draw",
  icons: '/favicon-light.svg',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <Providers>
          {/* Header */}

          {children}
        </Providers>
      </body>
    </html>
  );
}
