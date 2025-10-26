"use client";

import { CategoryFilter } from "@/components/filters/category-filter";
import Sidebar from "@/components/navigation/sidebar";
import { SummarySection } from "@/components/dashboard/summary-section";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { PublicTransactionTable } from "@/components/transactions/public-transaction-table";
import { Input } from "@/components/ui/input";
import { useStore } from "@/stores/provider";
import { Category as TransactionCategory } from "@/stores/types/Category";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { aggregatesApi } from "@/api/routes/aggregates";
import { formatEther } from "viem";
import type { Category as CategoryDetail } from "@/types/interfaces/Category";
import type { PayNote } from "@/types/interfaces/PayNote";

interface PublicTransactionRow {
  hash: string;
  from: string;
  to: string;
  status: PayNote["status"];
  usd: string;
  eth: string;
  network: string;
  ts: string;
  category: string;
}

interface AggregatedSummary {
  totalCount: number;
  totalUsd: number;
  totalEth: number;
  confirmed: number;
  pending: number;
}

interface AggregatesResponse {
  publicTableRows: PublicTransactionRow[];
  aggregatedSummary: AggregatedSummary;
  aggregatedByCategory: unknown;
  aggregatedByNetwork: unknown;
  dailySummaries: unknown;
}

const CATEGORY_COLOR_MAP: Record<
  Exclude<TransactionCategory, TransactionCategory.All>,
  { color: string; icon: string }
> = {
  [TransactionCategory.Personal]: { color: "#FDE68A", icon: "👤" },
  [TransactionCategory.Operations]: { color: "#BFDBFE", icon: "🏢" },
  [TransactionCategory.Payroll]: { color: "#FCA5A5", icon: "💸" },
  [TransactionCategory.ResearchAndDevelopment]: {
    color: "#C4B5FD",
    icon: "🧪",
  },
  [TransactionCategory.Customer]: { color: "#6EE7B7", icon: "🤝" },
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const weiToEthNumber = (valueWei: string) => {
  try {
    return Number(formatEther(BigInt(valueWei)));
  } catch {
    return 0;
  }
};

export default observer(function Landing() {
  const { authenticated, ready, login } = usePrivy();
  const { transactions } = useStore();
  const filteredItems = transactions.filteredItems;

  const [publicData, setPublicData] = useState<{
    rows: PublicTransactionRow[];
    summary: AggregatedSummary;
  } | null>(null);
  const [isLoadingPublic, setIsLoadingPublic] = useState(false);

  const summaries = useMemo(() => {
    const base = {
      totalUsd: 0,
      totalEth: 0,
      confirmed: 0,
    };

    const aggregate = filteredItems.reduce((acc, item) => {
      const next = { ...acc };
      const usd = Number(item.fiatValueUsd ?? 0);
      const eth = weiToEthNumber(item.amountWei);

      if (!Number.isNaN(usd)) next.totalUsd += usd;
      if (!Number.isNaN(eth)) next.totalEth += eth;
      if (item.status === "Settled") next.confirmed += 1;

      return next;
    }, base);

    const totalCount = filteredItems.length;
    const usdFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    });

    const ethFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const confirmationRate =
      totalCount === 0
        ? "—"
        : `${Math.round((aggregate.confirmed / totalCount) * 100)}%`;

    const isFiltered =
      transactions.categoryFilter !== TransactionCategory.All ||
      Boolean(transactions.search.trim());

    return [
      {
        label: "Filtered volume",
        value: usdFormatter.format(aggregate.totalUsd || 0),
        helper: `${ethFormatter.format(aggregate.totalEth || 0)} ETH`,
      },
      {
        label: "Confirmation rate",
        value: confirmationRate,
        helper: `${aggregate.confirmed}/${totalCount || 0} confirmed`,
      },
      {
        label: "Active filters",
        value: isFiltered ? "Focused view" : "All activity",
        helper: isFiltered
          ? `${transactions.categoryFilter}${
              transactions.search ? " + search" : ""
            }`
          : "No filters applied",
      },
    ];
  }, [filteredItems, transactions.categoryFilter, transactions.search]);

  const topCategories = useMemo<CategoryDetail[]>(() => {
    const counts = new Map<TransactionCategory, number>();

    transactions.items.forEach((item) => {
      const categoryName = item.categories?.[0]?.name as
        | TransactionCategory
        | undefined;
      if (
        !categoryName ||
        categoryName === TransactionCategory.All
      )
        return;
      counts.set(categoryName, (counts.get(categoryName) || 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([category, count]) => {
        const meta =
          CATEGORY_COLOR_MAP[
            category as Exclude<TransactionCategory, TransactionCategory.All>
          ] || {
            color: "#E5E7EB",
            icon: "•",
          };

        return {
          categoryId: `mock-${category}`,
          orgId: "demo-org",
          name: category,
          color: meta.color,
          icon: `${meta.icon} ${count} tx`,
          visibility: "Private",
        };
      });
  }, [transactions.items]);

  const recentPayNotes = useMemo<PayNote[]>(() => {
    const cutoff = Date.now() - THIRTY_DAYS_MS;

    return transactions.items
      .filter((item) => item.timestamp * 1000 >= cutoff)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [transactions.items]);

  // Fetch public aggregate data for unauthenticated users
  useEffect(() => {
    if (ready && !authenticated) {
      setIsLoadingPublic(true);
      aggregatesApi
        .fetch()
        .then((data) => {
          const response = data as AggregatesResponse;
          setPublicData({
            rows: response.publicTableRows || [],
            summary: response.aggregatedSummary || {
              totalCount: 0,
              totalUsd: 0,
              totalEth: 0,
              confirmed: 0,
              pending: 0,
            },
          });
        })
        .catch((err) => {
          console.error("Failed to load public data:", err);
        })
        .finally(() => {
          setIsLoadingPublic(false);
        });
    }
  }, [authenticated, ready]);

  const publicSummaries = useMemo(() => {
    if (!publicData) return [];

    const { summary } = publicData;
    const usdFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    });
    const ethFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const confirmationRate =
      summary.totalCount === 0
        ? "—"
        : `${Math.round((summary.confirmed / summary.totalCount) * 100)}%`;

    return [
      {
        label: "Total volume",
        value: usdFormatter.format(summary.totalUsd || 0),
        helper: `${ethFormatter.format(summary.totalEth || 0)} ETH`,
      },
      {
        label: "Confirmation rate",
        value: confirmationRate,
        helper: `${summary.confirmed}/${summary.totalCount || 0} confirmed`,
      },
      {
        label: "Total transactions",
        value: String(summary.totalCount || 0),
        helper: `${summary.pending || 0} pending`,
      },
    ];
  }, [publicData]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mint-wash">
        <div className="rounded-2xl border border-border/70 bg-card/80 px-6 py-4 text-sm text-muted-foreground shadow-card">
          Loading...
        </div>
      </div>
    );
  }

  // Public dashboard for unauthenticated users
  if (!authenticated) {
    return (
      <Sidebar>
        <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 pb-10 sm:p-8">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-mint-wash" />

          {isLoadingPublic ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">
                Loading public data...
              </div>
            </div>
          ) : (
            <>
              <SummarySection summaries={publicSummaries} />
              <PublicTransactionTable
                items={publicData?.rows || []}
                onSignIn={login}
              />
            </>
          )}
        </main>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 pb-10 sm:p-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-mint-wash" />

        <SummarySection
          summaries={summaries}
          topCategories={topCategories}
          recentPayNotes={recentPayNotes}
        />

        <section className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-card backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-wrap gap-3">
              <CategoryFilter />
              <div className="min-w-[240px] flex-1">
                <Input
                  placeholder="Search hash, sender, or recipient"
                  value={transactions.search}
                  onChange={(event) =>
                    transactions.setSearch(event.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {transactions.error ? (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {transactions.error}
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Transactions
              </p>
              <p className="text-xs text-muted-foreground">
                Filtered total: {filteredItems.length}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-accent/60 px-3 py-1 text-xs font-semibold text-accent-foreground">
              Live data mock
            </span>
          </div>
          <TransactionTable items={filteredItems} />
        </section>
      </main>
    </Sidebar>
  );
});
