import { parseEther } from "viem";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";
import type { Category as CategoryDetail } from "@/types/interfaces/Category";
import type { Network } from "@/types/interfaces/Network";

const NETWORKS: Record<
  "optimismMainnet" | "optimismSepolia" | "baseMainnet" | "baseSepolia",
  Network
> = {
  optimismMainnet: {
    chainId: 10,
    name: "Optimism Mainnet",
    explorerBaseUrl: "https://optimistic.etherscan.io",
    nativeSymbol: "ETH",
  },
  optimismSepolia: {
    chainId: 11155420,
    name: "Optimism Sepolia",
    explorerBaseUrl: "https://sepolia-optimistic.etherscan.io",
    nativeSymbol: "ETH",
  },
  baseMainnet: {
    chainId: 8453,
    name: "Base Mainnet",
    explorerBaseUrl: "https://basescan.org",
    nativeSymbol: "ETH",
  },
  baseSepolia: {
    chainId: 84532,
    name: "Base Sepolia",
    explorerBaseUrl: "https://sepolia.basescan.org",
    nativeSymbol: "ETH",
  },
};

const CATEGORY_LOOKUP: Record<string, CategoryDetail> = {
  Operations: {
    categoryId: "cat-operations",
    orgId: "demo-org",
    name: "Operations",
    color: "#BFDBFE",
    icon: "building",
    visibility: "Private",
  },
  Personal: {
    categoryId: "cat-personal",
    orgId: "demo-org",
    name: "Personal",
    color: "#FDE68A",
    icon: "user",
    visibility: "Private",
  },
  Payroll: {
    categoryId: "cat-payroll",
    orgId: "demo-org",
    name: "Payroll",
    color: "#FCA5A5",
    icon: "wallet",
    visibility: "Private",
  },
  Customer: {
    categoryId: "cat-customer",
    orgId: "demo-org",
    name: "Customer",
    color: "#6EE7B7",
    icon: "users",
    visibility: "Private",
  },
  "Research and Development": {
    categoryId: "cat-rnd",
    orgId: "demo-org",
    name: "Research and Development",
    color: "#C4B5FD",
    icon: "beaker",
    visibility: "Private",
  },
};

const toUnixTime = (isoTimestamp: string) =>
  Math.floor(new Date(isoTimestamp).getTime() / 1000);

export type ExamplePayNote = PayNoteExpanded;

export const examplePayNotes: ExamplePayNote[] = [
  {
    payNoteId: "0x8f1c56cfa6f27a611dcb0d1f9d7a27bd1c1df5a2d907f96695df8d90fa1a2e11",
    txHash: "0x8f1c56cfa6f27a611dcb0d1f9d7a27bd1c1df5a2d907f96695df8d90fa1a2e11",
    chainId: NETWORKS.optimismSepolia.chainId,
    senderWalletId: "0xA19fB282BFe21C17790F7a47b0B9d6D52904813A",
    recipientWalletId: "0xF98b0c77776816170c2Af0dD0FE4321cA3F7afC8",
    amountWei: parseEther("1.25").toString(),
    fiatValueUsd: "3850",
    payReference: "Monthly infra spend",
    timestamp: toUnixTime("2025-01-22T14:13:00Z"),
    status: "Settled",
    orgId: "demo-org",
    categories: [CATEGORY_LOOKUP.Operations],
    network: NETWORKS.optimismSepolia,
  },
  {
    payNoteId: "0xd28d82cdee5800ce659a89f6ca9f3997747f83f52ea95d7f92f5ec5327c0bd4d",
    txHash: "0xd28d82cdee5800ce659a89f6ca9f3997747f83f52ea95d7f92f5ec5327c0bd4d",
    chainId: NETWORKS.baseSepolia.chainId,
    senderWalletId: "0xa5E2Da383274Fa6b5d2c47D6C94F3Fd60ca6845f",
    recipientWalletId: "0x5c20a1C02f1263d8E3B49fFf84D37dAa0F04d3e1",
    amountWei: parseEther("0.32").toString(),
    fiatValueUsd: "985",
    payReference: "Team stipend",
    timestamp: toUnixTime("2025-01-21T09:42:00Z"),
    status: "Settled",
    orgId: "demo-org",
    categories: [CATEGORY_LOOKUP.Personal],
    network: NETWORKS.baseSepolia,
  },
  {
    payNoteId: "0x5cde43ef1f34341b6d1941f2af4d5ff55ba2a8fec209ef2c92aea1e22df0fa1c",
    txHash: "0x5cde43ef1f34341b6d1941f2af4d5ff55ba2a8fec209ef2c92aea1e22df0fa1c",
    chainId: NETWORKS.optimismMainnet.chainId,
    senderWalletId: "0xE6C42a8dc992a83d0ac497Bc7892A875c3A9d55B",
    recipientWalletId: "0x44a3d108f38555a06eFaEE27d5181b3439172fF1",
    amountWei: parseEther("2.80").toString(),
    fiatValueUsd: "8625",
    payReference: "Contractor payout",
    timestamp: toUnixTime("2025-01-20T18:07:00Z"),
    status: "Settled",
    orgId: "demo-org",
    categories: [CATEGORY_LOOKUP.Payroll],
    network: NETWORKS.optimismMainnet,
  },
  {
    payNoteId: "0x72f0c3f11842631f7a0bb637c53ff3830c9fe52ef7b617d11d6b6dc09f5ac221",
    txHash: "0x72f0c3f11842631f7a0bb637c53ff3830c9fe52ef7b617d11d6b6dc09f5ac221",
    chainId: NETWORKS.optimismSepolia.chainId,
    senderWalletId: "0x0f4a757Cb481159D53bC12F22CbB8F5Ff8091efE",
    recipientWalletId: "0x8b9124d7c5fE1F602568A3c913C3Dfcd8247B87f",
    amountWei: parseEther("0.08").toString(),
    fiatValueUsd: "246",
    payReference: null,
    timestamp: toUnixTime("2025-01-19T11:55:00Z"),
    status: "Pending",
    orgId: "demo-org",
    categories: [CATEGORY_LOOKUP.Customer],
    network: NETWORKS.optimismSepolia,
  },
  {
    payNoteId: "0x0c7b2e014df16472d311e008256cf0122dc4833aa4a385239b5c2d67c7054491",
    txHash: "0x0c7b2e014df16472d311e008256cf0122dc4833aa4a385239b5c2d67c7054491",
    chainId: NETWORKS.baseMainnet.chainId,
    senderWalletId: "0xf0C5ac722cb5A9c324fF84c35179A7Ae2F01231a",
    recipientWalletId: "0x4477f72868Fdc9c8E8Fc9945b6E32956543a07e4",
    amountWei: parseEther("1.95").toString(),
    fiatValueUsd: "6005",
    payReference: "Testnet faucet streaming",
    timestamp: toUnixTime("2025-01-17T16:21:00Z"),
    status: "Settled",
    orgId: "demo-org",
    categories: [CATEGORY_LOOKUP["Research and Development"]],
    network: NETWORKS.baseMainnet,
  },
  {
    payNoteId: "0x1d0fbea161bb3c2971094a8845bc3c4df436f121b4d2b0ed0278289161af6c22",
    txHash: "0x1d0fbea161bb3c2971094a8845bc3c4df436f121b4d2b0ed0278289161af6c22",
    chainId: NETWORKS.optimismSepolia.chainId,
    senderWalletId: "0xe118ec8bbbd432133788a50EEAcD8D3E9E25b88c",
    recipientWalletId: "0xfBB8C347ADa8Fe591A2baA52Fd03E5318C2c1c90",
    amountWei: parseEther("0.54").toString(),
    fiatValueUsd: "1670",
    payReference: "Node service credits",
    timestamp: toUnixTime("2025-01-15T08:02:00Z"),
    status: "Settled",
    orgId: "demo-org",
    categories: [CATEGORY_LOOKUP.Operations],
    network: NETWORKS.optimismSepolia,
  },
];
