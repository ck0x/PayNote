"use client";

import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { CategoryFilter } from "@/components/filters/category-filter";
import SidebarToggle from "@/components/navigation/sidebar-toggle";
import Sidebar from "@/components/navigation/sidebar";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Landing() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-feather-600 to-feather-500 bg-clip-text text-transparent">
              PayNote
            </h1>
          </div>
          <div className="flex gap-3">
            <WalletConnectButton />
          </div>
        </section>

        <section className="rounded-lg border-2 border-feather-600/10 p-6 bg-gradient-to-br from-ice-100/50 to-paper-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <CategoryFilter />
            {/* search input, date range, etc. */}
          </div>
          {/* Placeholder: list of public on-chain transactions */}
          <div className="text-sm text-graphite-700 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-feather-600 animate-pulse"></div>
            Public on-chain transactions will appear here. (Envio integration
            coming.)
          </div>
        </section>
      </main>
    </Sidebar>
  );
}
