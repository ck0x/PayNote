"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { Web3Provider } from "../config/wagmi";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/stores/provider";
import SidebarProvider from "@/components/navigation/sidebar-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <StoreProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </StoreProvider>
      </ThemeProvider>
    </Web3Provider>
  );
}
