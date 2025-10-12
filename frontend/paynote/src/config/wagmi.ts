import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("ReOwn Project ID is not defined");
}

export const wagmiConfig = getDefaultConfig({
  appName: "PayNote",
  projectId: projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // Required for Next.js
});
