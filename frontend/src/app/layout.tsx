import "../css/reset.css";

import Header from "@/components/Header/Header";
import Providers from "@/providers/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../css/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "4 Draw",
  description: "4Draw is a decentralized lottery game featuring a smart contract for transparent operations, a user-friendly UI for ticket purchases and prize claims, and integration with Pragma’s VRF contract to ensure fairness.",
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
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
