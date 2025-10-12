"use client";

import { http } from "wagmi";
import { optimism, optimismSepolia } from "wagmi/chains";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { cookieStorage, createStorage } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("ReOwn Project ID is not defined");
}

const target =
  process.env.NEXT_PUBLIC_CHAIN_ID === "10" ? optimism : optimismSepolia;

export const wagmiConfig = getDefaultConfig({
  appName: "PayNote",
  projectId: projectId,
  chains: [target],
  transports: {
    [target.id]: http(),
  },
  ssr: true, // Required for Next.js
  storage: createStorage({ storage: cookieStorage }), // persist connectors
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        appInfo={{ appName: "PayNote" }}
        theme={{
          lightMode: lightTheme(),
          darkMode: darkTheme(),
        }}
      >
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  );
}
