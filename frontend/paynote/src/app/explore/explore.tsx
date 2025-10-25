"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PayNote } from "@/types/interfaces/PayNote";
import type { Network } from "@/types/interfaces/Network";
import type { Category } from "@/types/interfaces/Category";

/**
 * Explore Transactions Page
 * Public/first-visit stream of PayNotes with search, filters, chain selector
 * Entities: PayNote, Wallet, Network, Category
 */
export default function ExplorePage() {
  // TODO: Fetch PayNotes from API/indexer
  const payNotes: PayNote[] = [];
  const networks: Network[] = [];
  const categories: Category[] = [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Explore Transactions</h1>
            <p className="text-muted-foreground mt-1">
              Browse all PayNotes across networks
            </p>
          </div>
          <Button variant="default">Connect Wallet</Button>
        </div>

        {/* Filters & Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by hash, address, or reference..."
              className="flex-1"
            />
            <select className="px-3 py-2 rounded-md border bg-background">
              <option value="">All Networks</option>
              {networks.map((network) => (
                <option key={network.chainId} value={network.chainId}>
                  {network.name}
                </option>
              ))}
            </select>
            <select className="px-3 py-2 rounded-md border bg-background">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* PayNotes List */}
        <div className="grid gap-4">
          {payNotes.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No transactions found. Start exploring!</p>
            </Card>
          ) : (
            payNotes.map((note) => (
              <Card key={note.payNoteId} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="font-mono text-sm text-muted-foreground">
                      {note.txHash}
                    </p>
                    <p className="font-semibold">{note.payReference}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 rounded bg-muted">
                        {note.status}
                      </span>
                      <span className="text-muted-foreground">
                        {note.amountWei} wei
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
