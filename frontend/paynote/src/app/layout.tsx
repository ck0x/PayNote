import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "../context/providers";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <Navbar>
            <main className="p-4">{children}</main>
          </Navbar>
        </Providers>
      </body>
    </html>
  );
}
