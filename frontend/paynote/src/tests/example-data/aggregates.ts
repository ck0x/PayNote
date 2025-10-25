import { exampleTransactions, ExampleTransaction } from "./transactions";
import { Category } from "@/stores/types/Category";

export type CategoryAggregate = {
  category: Category | "Unknown";
  count: number;
  totalUsd: number;
  totalEth: number;
};

export type NetworkAggregate = {
  network: string;
  count: number;
  totalUsd: number;
  totalEth: number;
};

export type AggregatedSummary = {
  totalCount: number;
  totalUsd: number;
  totalEth: number;
  confirmed: number;
  pending: number;
};

function toNumber(v: string | number) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export const aggregatedSummary: AggregatedSummary = exampleTransactions.reduce(
  (acc, tx) => {
    const usd = toNumber(tx.valueUsd);
    const eth = toNumber(tx.valueEth);
    acc.totalCount += 1;
    acc.totalUsd += usd;
    acc.totalEth += eth;
    if (tx.status === "confirmed") acc.confirmed += 1;
    else acc.pending += 1;
    return acc;
  },
  {
    totalCount: 0,
    totalUsd: 0,
    totalEth: 0,
    confirmed: 0,
    pending: 0,
  } as AggregatedSummary
);

export const aggregatedByCategory: CategoryAggregate[] = (() => {
  const map = new Map<string, CategoryAggregate>();

  for (const tx of exampleTransactions) {
    const key = tx.category ?? "Unknown";
    const usd = toNumber(tx.valueUsd);
    const eth = toNumber(tx.valueEth);
    const existing = map.get(String(key));
    if (existing) {
      existing.count += 1;
      existing.totalUsd += usd;
      existing.totalEth += eth;
    } else {
      map.set(String(key), {
        category: (key as Category) || "Unknown",
        count: 1,
        totalUsd: usd,
        totalEth: eth,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalUsd - a.totalUsd);
})();

export const aggregatedByNetwork: NetworkAggregate[] = (() => {
  const map = new Map<string, NetworkAggregate>();

  for (const tx of exampleTransactions) {
    const key = tx.network || "Unknown";
    const usd = toNumber(tx.valueUsd);
    const eth = toNumber(tx.valueEth);
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      existing.totalUsd += usd;
      existing.totalEth += eth;
    } else {
      map.set(key, { network: key, count: 1, totalUsd: usd, totalEth: eth });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
})();

export const dailySummaries = (() => {
  const map = new Map<
    string,
    { date: string; count: number; totalUsd: number }
  >();
  for (const tx of exampleTransactions) {
    const date = new Date(tx.ts).toISOString().slice(0, 10);
    const usd = toNumber(tx.valueUsd);
    const existing = map.get(date);
    if (existing) {
      existing.count += 1;
      existing.totalUsd += usd;
    } else {
      map.set(date, { date, count: 1, totalUsd: usd });
    }
  }
  return Array.from(map.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
})();

export type PublicTransactionRow = {
  hash: string;
  from: string;
  to: string;
  usd: string;
  eth: string;
  ts: string;
  status: ExampleTransaction["status"];
  network: string;
  category: Category | string;
};

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const ethFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const publicTableRows: PublicTransactionRow[] = exampleTransactions.map(
  (tx) => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    usd: usdFormatter.format(toNumber(tx.valueUsd)),
    eth: `${ethFormatter.format(toNumber(tx.valueEth))} ETH`,
    ts: tx.ts,
    status: tx.status,
    network: tx.network,
    category: tx.category || "Unknown",
  })
);

const aggregates = {
  aggregatedSummary,
  aggregatedByCategory,
  aggregatedByNetwork,
  dailySummaries,
  publicTableRows,
};

export default aggregates;
