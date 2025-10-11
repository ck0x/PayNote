import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";

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
      url: configVariable("OPTIMISM_SEPOLIA_RPC_URL"),
      accounts: [configVariable("OPTIMISM_SEPOLIA_PRIVATE_KEY")],
    },
    optimism: {
      type: "http",
      chainType: "op",
      url: configVariable("OPTIMISM_RPC_URL"),
      accounts: [configVariable("OPTIMISM_PRIVATE_KEY")],
    },
  },
  verify: {
    etherscan: {
      apiKey: configVariable("OPTIMISM_ETHERSCAN_API_KEY"),
    },
  },
  chainDescriptors: {
    // Optimism Sepolia (Testnet)
    11155420: {
      name: "Optimism Sepolia",
      blockExplorers: {
        etherscan: {
          name: "Optimism Sepolia Etherscan",
          url: "https://sepolia-optimism.etherscan.io",
          apiUrl: "https://api-sepolia-optimistic.etherscan.io/api",
        },
      },
    },
    // Optimism Mainnet
    10: {
      name: "Optimism",
      blockExplorers: {
        etherscan: {
          name: "Optimism Etherscan",
          url: "https://optimistic.etherscan.io",
          apiUrl: "https://api-optimistic.etherscan.io/api",
        },
      },
    },
  },
};

export default config;
