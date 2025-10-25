"use client";

import { TransactionItem } from "@/stores/transaction.store";

type TransactionTableProps = {
  items: TransactionItem[];
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

const formatUsd = (value: string) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return `$${value}`;
  return usdFormatter.format(numericValue);
};

const formatTimestamp = (ts: string) => {
  return `${dateFormatter.format(new Date(ts))} UTC`;
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
              key={item.hash}
              className="border-t border-border/60 odd:bg-muted/10"
            >
              <td className="py-4 pl-4 pr-4 align-top font-mono text-xs text-muted-foreground">
                {truncate(item.hash)}
              </td>
              <td className="py-4 pr-4 align-top font-mono text-xs">
                {truncate(item.from)}
              </td>
              <td className="py-4 pr-4 align-top font-mono text-xs">
                {truncate(item.to)}
              </td>
              <td className="py-4 pr-4 align-top">
                <div className="font-semibold text-foreground">
                  {item.valueEth} ETH
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatUsd(item.valueUsd)}
                </div>
              </td>
              <td className="py-4 pr-4 align-top text-xs">
                <span className="inline-flex rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
                  {item.category}
                </span>
              </td>
              <td className="py-4 pr-4 align-top text-xs">
                <div className="font-medium text-foreground">
                  {item.network}
                </div>
                <div className="text-muted-foreground">
                  {formatTimestamp(item.ts)}
                </div>
              </td>
              <td className="py-4 pr-4 align-top text-xs font-semibold">
                <span
                  className={
                    item.status === "confirmed"
                      ? "text-success"
                      : "text-warning"
                  }
                >
                  {item.status}
                </span>
              </td>
              <td className="py-4 pr-4 align-top text-xs text-muted-foreground">
                {item.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
