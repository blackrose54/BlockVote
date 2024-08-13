import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import Navbar from "@/components/Navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlockVote",
  description: "Decentralised Voting Platform",
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
          <Navbar />

          <AuroraBackground>{children}</AuroraBackground>
        </Providers>
      </body>
    </html>
  );
}
