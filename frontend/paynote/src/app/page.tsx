"use client";

import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { CategoryFilter } from "@/components/filters/category-filter";
import SidebarToggle from "@/components/navigation/sidebar-toggle";
import Sidebar from "@/components/navigation/sidebar";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { Input } from "@/components/ui/input";
import { useStore } from "@/stores/provider";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

export default observer(function Landing() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const { transactions } = useStore();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/auth");
    }
  }, [authenticated, ready, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Redirecting to sign in...</div>
      </div>
    );
  }

  return (
    <Sidebar>
      <main className="mx-auto max-w-5xl p-8 space-y-8">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            <h1 className="text-3xl font-semibold">PayNote</h1>
          </div>
          <div className="flex gap-3">
            <WalletConnectButton />
          </div>
        </section>

        <section className="rounded-2xl border p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <CategoryFilter />
            <div className="w-full min-w-[240px] flex-1 md:max-w-sm">
              <Input
                placeholder="Search hash, sender, or recipient"
                value={transactions.search}
                onChange={(event) => transactions.setSearch(event.target.value)}
              />
            </div>
          </div>

          {transactions.error ? (
            <div className="text-sm text-destructive">
              {transactions.error}
            </div>
          ) : null}

          <TransactionTable items={transactions.filteredItems} />
        </section>
      </main>
    </Sidebar>
  );
});
