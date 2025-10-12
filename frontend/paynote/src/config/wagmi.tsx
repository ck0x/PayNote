"use client";

import { Config, cookieToInitialState, http, WagmiProvider } from "wagmi";
import { mainnet, optimism, optimismSepolia } from "wagmi/chains";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { cookieStorage, createStorage } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit, Metadata } from "@reown/appkit";

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("ReOwn Project ID is not defined");
}

const target =
  process.env.NEXT_PUBLIC_CHAIN_ID === "10" ? optimism : optimismSepolia;

export const networks = [optimism, optimismSepolia];

export const metadata: Metadata = {
  name: "PayNote",
  description: "Web3 payments and transaction analysis dashboard",
  url: "https://github.com/ck0x/PayNote", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export const rainbowConfig = getDefaultConfig({
  appName: "PayNote",
  projectId: projectId,
  chains: [target],
  transports: {
    [target.id]: http(),
  },
  ssr: true, // Required for Next.js
  storage: createStorage({ storage: cookieStorage }), // persist connectors
});

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

export const appkit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, optimism, optimismSepolia],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ["google", "x", "github", "discord"],
    emailShowWallets: true,
  },
  themeMode: "light",
});

export function Web3Provider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies?: string;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider
        config={wagmiAdapter.wagmiConfig as Config}
        initialState={initialState}
      >
        <RainbowKitProvider
          appInfo={{ appName: "PayNote" }}
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
