"use client";

import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";
import { formatEther } from "viem";

type TransactionTableProps = {
  items: PayNoteExpanded[];
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const truncate = (value: string) => {
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const formatUsd = (value?: string | null) => {
  if (value == null) return "—";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return `$${value}`;
  return usdFormatter.format(numericValue);
};

const formatTimestamp = (unixSeconds: number) => {
  return `${dateFormatter.format(new Date(unixSeconds * 1000))} UTC`;
};

const formatEthAmount = (wei: string) => {
  try {
    return formatEther(BigInt(wei));
  } catch {
    return "0";
  }
};

const getCategoryName = (item: PayNoteExpanded) =>
  item.categories?.[0]?.name ?? "Uncategorized";

const getNetworkName = (item: PayNoteExpanded) =>
  item.network?.name ?? `Chain ${item.chainId}`;

const getStatusTone = (status: PayNoteExpanded["status"]) => {
  if (status === "Settled") return "text-success";
  if (status === "Pending") return "text-warning";
  return "text-destructive";
};

export function TransactionTable({ items }: TransactionTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
        No transactions matched your filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-inset">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="py-3 pl-4 pr-4 text-left font-semibold">Hash</th>
            <th className="py-3 pr-4 text-left font-semibold">From</th>
            <th className="py-3 pr-4 text-left font-semibold">To</th>
            <th className="py-3 pr-4 text-left font-semibold">Amount</th>
            <th className="py-3 pr-4 text-left font-semibold">Category</th>
            <th className="py-3 pr-4 text-left font-semibold">
              Network / Time
            </th>
            <th className="py-3 pr-4 text-left font-semibold">Status</th>
            <th className="py-3 pr-4 text-left font-semibold">Note</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.payNoteId}
              className="border-t border-border/60 odd:bg-muted/10"
            >
              <td className="py-4 pl-4 pr-4 align-top font-mono text-xs text-muted-foreground">
                {truncate(item.txHash)}
              </td>
              <td className="py-4 pr-4 align-top font-mono text-xs">
                {truncate(item.senderWalletId)}
              </td>
              <td className="py-4 pr-4 align-top font-mono text-xs">
                {truncate(item.recipientWalletId)}
              </td>
              <td className="py-4 pr-4 align-top">
                <div className="font-semibold text-foreground">
                  {formatEthAmount(item.amountWei)} ETH
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatUsd(item.fiatValueUsd)}
                </div>
              </td>
              <td className="py-4 pr-4 align-top text-xs">
                <span className="inline-flex rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
                  {getCategoryName(item)}
                </span>
              </td>
              <td className="py-4 pr-4 align-top text-xs">
                <div className="font-medium text-foreground">
                  {getNetworkName(item)}
                </div>
                <div className="text-muted-foreground">
                  {formatTimestamp(item.timestamp)}
                </div>
              </td>
              <td className="py-4 pr-4 align-top text-xs font-semibold">
                <span className={getStatusTone(item.status)}>
                  {item.status}
                </span>
              </td>
              <td className="py-4 pr-4 align-top text-xs text-muted-foreground">
                {item.payReference ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
