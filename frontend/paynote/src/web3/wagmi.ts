"use client";
import { http, createConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const config = getDefaultConfig({
  appName: "PayNote",
  projectId: "fa9ae0127303a50438814ee2ee80d945",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});
