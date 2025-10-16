"use client";

import { Web3Provider } from "../config/wagmi";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/stores/provider";
import SidebarProvider from "@/components/navigation/sidebar-provider";
import { PrivyProvider } from "@privy-io/react-auth";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={privyAppId}
      clientId={privyClientId}
      config={{
        loginMethods: ["email", "google", "twitter", "farcaster", "github"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          walletChainType: "ethereum-only",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <Web3Provider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <StoreProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </StoreProvider>
        </ThemeProvider>
      </Web3Provider>
    </PrivyProvider>
  );
}
