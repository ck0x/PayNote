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
      <div className="text-sm text-muted-foreground">
        No transactions matched your filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-xs uppercase text-muted-foreground">
          <tr>
            <th className="py-2 pr-4 text-left">Hash</th>
            <th className="py-2 pr-4 text-left">From</th>
            <th className="py-2 pr-4 text-left">To</th>
            <th className="py-2 pr-4 text-left">Amount</th>
            <th className="py-2 pr-4 text-left">Category</th>
            <th className="py-2 pr-4 text-left">Network / Time</th>
            <th className="py-2 pr-4 text-left">Status</th>
            <th className="py-2 text-left">Note</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.hash} className="border-b last:border-b-0">
              <td className="py-3 pr-4 align-top font-mono text-xs text-muted-foreground">
                {truncate(item.hash)}
              </td>
              <td className="py-3 pr-4 align-top font-mono text-xs">
                {truncate(item.from)}
              </td>
              <td className="py-3 pr-4 align-top font-mono text-xs">
                {truncate(item.to)}
              </td>
              <td className="py-3 pr-4 align-top">
                <div className="font-medium">{item.valueEth} ETH</div>
                <div className="text-xs text-muted-foreground">
                  {formatUsd(item.valueUsd)}
                </div>
              </td>
              <td className="py-3 pr-4 align-top text-xs">
                {item.category}
              </td>
              <td className="py-3 pr-4 align-top text-xs">
                <div>{item.network}</div>
                <div className="text-muted-foreground">
                  {formatTimestamp(item.ts)}
                </div>
              </td>
              <td className="py-3 pr-4 align-top text-xs font-medium">
                <span
                  className={
                    item.status === "confirmed"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }
                >
                  {item.status}
                </span>
              </td>
              <td className="py-3 align-top text-xs text-muted-foreground">
                {item.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
