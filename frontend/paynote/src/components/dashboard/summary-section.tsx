"use client";

import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import SidebarToggle from "@/components/navigation/sidebar-toggle";

interface SummarySectionProps {
  summaries: Array<{
    label: string;
    value: string;
    helper: string;
  }>;
}

export function SummarySection({ summaries }: SummarySectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/60 bg-brand-gradient shadow-card text-white dark:text-white">
      <div id="summary-section" className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-black/70 dark:text-white/70">
                PayNote HQ
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white">
                Transaction Summary
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
              <p className="text-xs uppercase tracking-wide text-black/70 dark:text-white/70">
                {summary.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-black dark:text-white">
                {summary.value}
              </p>
              <p className="text-sm text-black/80 dark:text-white/80">
                {summary.helper}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
