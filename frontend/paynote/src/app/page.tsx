"use client";

import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { CategoryFilter } from "@/components/filters/category-filter";
import SidebarToggle from "@/components/navigation/sidebar-toggle";
import Sidebar from "@/components/navigation/sidebar";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { Input } from "@/components/ui/input";
import { useStore } from "@/stores/provider";
import { Category } from "@/stores/types/Category";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";

export default observer(function Landing() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const { transactions } = useStore();
  const filteredItems = transactions.filteredItems;

  const summaries = useMemo(() => {
    const base = {
      totalUsd: 0,
      totalEth: 0,
      confirmed: 0,
    };

    const aggregate = filteredItems.reduce((acc, item) => {
      const next = { ...acc };
      const usd = Number(item.valueUsd);
      const eth = Number(item.valueEth);

      if (!Number.isNaN(usd)) next.totalUsd += usd;
      if (!Number.isNaN(eth)) next.totalEth += eth;
      if (item.status === "confirmed") next.confirmed += 1;

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
      transactions.categoryFilter !== Category.All ||
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
  }, [
    filteredItems,
    transactions.categoryFilter,
    transactions.search,
  ]);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/auth");
    }
  }, [authenticated, ready, router]);

  const renderGateScreen = (message: string) => (
    <div className="flex min-h-screen items-center justify-center bg-mint-wash">
      <div className="rounded-2xl border border-border/70 bg-card/80 px-6 py-4 text-sm text-muted-foreground shadow-card">
        {message}
      </div>
    </div>
  );

  if (!ready) return renderGateScreen("Loading your workspace...");
  if (!authenticated)
    return renderGateScreen("Redirecting you to sign in...");

  return (
    <Sidebar>
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 pb-10 sm:p-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-mint-wash" />

        <section className="overflow-hidden rounded-3xl border border-border/60 bg-brand-gradient text-primary-foreground shadow-card">
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <SidebarToggle />
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                    PayNote HQ
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Real-time treasury
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <WalletConnectButton />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {summaries.map((summary) => (
                <div
                  key={summary.label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-inset backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-wide text-white/70">
                    {summary.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {summary.value}
                  </p>
                  <p className="text-sm text-white/80">{summary.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-card backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-wrap gap-3">
              <CategoryFilter />
              <div className="min-w-[240px] flex-1">
                <Input
                  placeholder="Search hash, sender, or recipient"
                  value={transactions.search}
                  onChange={(event) => transactions.setSearch(event.target.value)}
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
