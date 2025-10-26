"use client";

import { DashboardHeaderCard } from "@/components/ui/home/dashboard-header-card";
import { DashboardKpiCard } from "@/components/ui/home/dashboard-kpi-card";
import { RecentPayNotesCard } from "@/components/ui/home/recent-paynotes-card";
import { TopCategoriesCard } from "@/components/ui/home/top-categories-card";
import type { PayNote } from "@/types/interfaces/PayNote";
import type { Category } from "@/types/interfaces/Category";

interface SummarySectionProps {
  summaries: Array<{
    label: string;
    value: string;
    helper: string;
  }>;
  headerTitle?: string;
  headerDescription?: string;
  eyebrow?: string;
  topCategories?: Category[];
  recentPayNotes?: PayNote[];
}

export function SummarySection({
  summaries,
  headerTitle = "Transaction Summary",
  headerDescription = "Organization overview and analytics",
  topCategories = [],
  recentPayNotes = [],
}: SummarySectionProps) {
  return (
    <section
      id="summary-section"
      className="overflow-hidden rounded-3xl border border-border/60 bg-brand-gradient shadow-card text-black dark:text-white"
    >
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <DashboardHeaderCard
          title={headerTitle}
          description={headerDescription}
          className="border-white/20 bg-transparent p-0 text-black shadow-none dark:text-white [&>h1]:text-black [&>p]:text-black/80 dark:[&>h1]:text-white dark:[&>p]:text-white/80"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {summaries.map((summary) => (
            <DashboardKpiCard
              key={summary.label}
              label={summary.label}
              value={summary.value}
              helper={summary.helper}
              className="border-white/20 bg-white/10 text-black backdrop-blur dark:text-white [&_h3]:text-black/70 dark:[&_h3]:text-white/80 [&_p.text-3xl]:text-black dark:[&_p.text-3xl]:text-white dark:[&_p.text-muted-foreground]:text-white/80"
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <TopCategoriesCard
            categories={topCategories}
            className="border-white/20 bg-white/10 text-black backdrop-blur dark:text-white [&_h2]:text-black dark:[&_h2]:text-white dark:[&_p.text-muted-foreground]:text-white/80"
          />
          <RecentPayNotesCard
            payNotes={recentPayNotes}
            className="border-white/20 bg-white/10 text-black backdrop-blur dark:text-white dark:[&_p.text-muted-foreground]:text-white/80"
          />
        </div>
      </div>
    </section>
  );
}
