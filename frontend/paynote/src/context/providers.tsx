"use client";

import { Web3Provider } from "../config/wagmi";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/stores/provider";
import SidebarProvider from "@/components/navigation/sidebar-provider";
import { PrivyProvider } from "@privy-io/react-auth";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { OrganizationProvider } from "./organization-context";

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
      <ToastProvider>
        <AuthProvider>
          <Web3Provider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <StoreProvider>
                <OrganizationProvider>
                  <SidebarProvider>{children}</SidebarProvider>
                </OrganizationProvider>
              </StoreProvider>
            </ThemeProvider>
          </Web3Provider>
        </AuthProvider>
      </ToastProvider>
    </PrivyProvider>
  );
}
