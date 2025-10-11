"use client";
import { http, createConfig } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [sepolia], // adjust per your target
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
  ssr: true,
});
