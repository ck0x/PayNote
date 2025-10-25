import { Category } from "@/stores/types/Category";

export type ExampleTransaction = {
  hash: string;
  from: string;
  to: string;
  valueEth: string;
  valueUsd: string;
  ts: string;
  status: "confirmed" | "pending";
  network: string;
  category: Category;
  note: string;
};

export const exampleTransactions: ExampleTransaction[] = [
  {
    hash: "0x8f1c56cfa6f27a611dcb0d1f9d7a27bd1c1df5a2d907f96695df8d90fa1a2e11",
    from: "0xA19fB282BFe21C17790F7a47b0B9d6D52904813A",
    to: "0xF98b0c77776816170c2Af0dD0FE4321cA3F7afC8",
    valueEth: "1.25",
    valueUsd: "3850",
    ts: "2025-01-22T14:13:00Z",
    status: "confirmed",
    network: "Optimism Sepolia",
    category: Category.Operations,
    note: "Monthly infra spend",
  },
  {
    hash: "0xd28d82cdee5800ce659a89f6ca9f3997747f83f52ea95d7f92f5ec5327c0bd4d",
    from: "0xa5E2Da383274Fa6b5d2c47D6C94F3Fd60ca6845f",
    to: "0x5c20a1C02f1263d8E3B49fFf84D37dAa0F04d3e1",
    valueEth: "0.32",
    valueUsd: "985",
    ts: "2025-01-21T09:42:00Z",
    status: "confirmed",
    network: "Base Sepolia",
    category: Category.Personal,
    note: "Team stipend",
  },
  {
    hash: "0x5cde43ef1f34341b6d1941f2af4d5ff55ba2a8fec209ef2c92aea1e22df0fa1c",
    from: "0xE6C42a8dc992a83d0ac497Bc7892A875c3A9d55B",
    to: "0x44a3d108f38555a06eFaEE27d5181b3439172fF1",
    valueEth: "2.80",
    valueUsd: "8625",
    ts: "2025-01-20T18:07:00Z",
    status: "confirmed",
    network: "Optimism Mainnet",
    category: Category.Payroll,
    note: "Contractor payout",
  },
  {
    hash: "0x72f0c3f11842631f7a0bb637c53ff3830c9fe52ef7b617d11d6b6dc09f5ac221",
    from: "0x0f4a757Cb481159D53bC12F22CbB8F5Ff8091efE",
    to: "0x8b9124d7c5fE1F602568A3c913C3Dfcd8247B87f",
    valueEth: "0.08",
    valueUsd: "246",
    ts: "2025-01-19T11:55:00Z",
    status: "pending",
    network: "Optimism Sepolia",
    category: Category.Customer,
    note: "Refund to user 0x8b9...",
  },
  {
    hash: "0x0c7b2e014df16472d311e008256cf0122dc4833aa4a385239b5c2d67c7054491",
    from: "0xf0C5ac722cb5A9c324fF84c35179A7Ae2F01231a",
    to: "0x4477f72868Fdc9c8E8Fc9945b6E32956543a07e4",
    valueEth: "1.95",
    valueUsd: "6005",
    ts: "2025-01-17T16:21:00Z",
    status: "confirmed",
    network: "Base Mainnet",
    category: Category.ResearchAndDevelopment,
    note: "Testnet faucet streaming",
  },
  {
    hash: "0x1d0fbea161bb3c2971094a8845bc3c4df436f121b4d2b0ed0278289161af6c22",
    from: "0xe118ec8bbbd432133788a50EEAcD8D3E9E25b88c",
    to: "0xfBB8C347ADa8Fe591A2baA52Fd03E5318C2c1c90",
    valueEth: "0.54",
    valueUsd: "1670",
    ts: "2025-01-15T08:02:00Z",
    status: "confirmed",
    network: "Optimism Sepolia",
    category: Category.Operations,
    note: "Node service credits",
  },
];
