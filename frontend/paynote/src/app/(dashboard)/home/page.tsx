"use client";

import { Card } from "@/components/ui/card";
import type { AnalyticsDaily } from "@/types/interfaces/AnalyticsDaily";
import type { PayNote } from "@/types/interfaces/PayNote";
import type { Category } from "@/types/interfaces/Category";

/**
 * Dashboard (Org Home) Page
 * KPIs, trends, inflow/outflow, top categories, recent PayNotes
 * Entities: AnalyticsDaily, PayNote, Category
 */
export default function DashboardHomePage() {
  // TODO: Fetch from API
  const analytics: AnalyticsDaily[] = [];
  const recentPayNotes: PayNote[] = [];
  const topCategories: Category[] = [];

  // Calculate KPIs from analytics
  const totalTx = analytics.reduce((sum, a) => sum + a.totalTx, 0);
  const totalInflow = analytics.reduce((sum, a) => sum + BigInt(a.sumInWei), BigInt(0));
  const totalOutflow = analytics.reduce((sum, a) => sum + BigInt(a.sumOutWei), BigInt(0));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Organization overview and analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Transactions
          </h3>
          <p className="text-3xl font-bold mt-2">{totalTx}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Inflow
          </h3>
          <p className="text-3xl font-bold mt-2">{totalInflow.toString()} wei</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Outflow
          </h3>
          <p className="text-3xl font-bold mt-2">{totalOutflow.toString()} wei</p>
        </Card>
      </div>

      {/* Top Categories */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
        <div className="space-y-3">
          {topCategories.length === 0 ? (
            <p className="text-muted-foreground text-sm">No categories yet</p>
          ) : (
            topCategories.map((category) => (
              <div
                key={category.categoryId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {category.icon}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recent PayNotes */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {recentPayNotes.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No recent transactions
            </p>
          ) : (
            recentPayNotes.map((note) => (
              <div
                key={note.payNoteId}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">{note.payReference}</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {note.txHash.slice(0, 16)}...
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{note.amountWei} wei</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      note.status === "Settled"
                        ? "bg-green-100 text-green-800"
                        : note.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {note.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
