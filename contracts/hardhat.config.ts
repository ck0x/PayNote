import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-etherscan";
import "@nomicfoundation/hardhat-verify";
import { configVariable } from "hardhat/config";

// Extend HardhatUserConfig to include etherscan property
declare module "hardhat/config" {
  interface HardhatUserConfig {
    etherscan?: any;
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
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    optimismSepolia: {
      type: "http",
      chainType: "op",
      url: configVariable("OPTIMISM_SEPOLIA_RPC_URL", "https://sepolia.optimism.io"),
      accounts: [configVariable("PRIVATE_KEY")],
    },
    optimism: {
      type: "http",
      chainType: "op",
      url: configVariable("OPTIMISM_RPC_URL", "https://mainnet.optimism.io"),
      accounts: [configVariable("PRIVATE_KEY")],
    },
  },
  etherscan: {
    apiKey: {
      optimismSepolia: configVariable("OPTIMISM_ETHERSCAN_API_KEY", ""),
      optimism: configVariable("OPTIMISM_ETHERSCAN_API_KEY", ""),
    },
    customChains: [
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io",
        },
      },
    ],
  },
};

export default config;
