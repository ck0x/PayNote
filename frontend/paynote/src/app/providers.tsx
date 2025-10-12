"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { wagmiConfig, Web3Provider } from "../config/wagmi";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/stores/provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <Web3Provider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </Web3Provider>
    </WagmiProvider>
  );
}
