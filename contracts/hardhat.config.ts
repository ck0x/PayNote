import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";

// Helper to get config variable with fallback
function getConfigVariable(name: string, defaultValue?: string) {
  try {
    return configVariable(name);
  } catch {
    return defaultValue || "";
  }
}

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: getConfigVariable("SEPOLIA_RPC_URL"),
      accounts: [getConfigVariable("SEPOLIA_PRIVATE_KEY")],
    },
    optimismSepolia: {
      type: "http",
      chainType: "op",
      url: getConfigVariable("OPTIMISM_SEPOLIA_RPC_URL", "https://sepolia.optimism.io"),
      accounts: [getConfigVariable("PRIVATE_KEY")],
    },
    optimism: {
      type: "http",
      chainType: "op",
      url: getConfigVariable("OPTIMISM_RPC_URL", "https://mainnet.optimism.io"),
      accounts: [getConfigVariable("PRIVATE_KEY")],
    },
  },
};

export default config;
