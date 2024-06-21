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
  openGraph: {
    title: "4 Draw",
    siteName: "4 Draw",
    description: "4Draw is a decentralized lottery game featuring a smart contract for transparent operations, a user-friendly UI for ticket purchases and prize claims, and integration with Pragma’s VRF contract to ensure fairness.",
    url: 'https://draw-49019.web.app/',
    type: 'website',
    images: [{
      url: 'https://draw-49019.web.app/og-image.png', // Must be an absolute URL
      width: 800,
      height: 600,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "4 Draw",
    description: "4Draw is a decentralized lottery game featuring a smart contract for transparent operations, a user-friendly UI for ticket purchases and prize claims, and integration with Pragma’s VRF contract to ensure fairness.",
    images: ['https://draw-49019.web.app/og-image.png'],
  }
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
