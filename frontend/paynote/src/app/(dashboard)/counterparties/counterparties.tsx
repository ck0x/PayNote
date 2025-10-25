"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Counterparty } from "@/types/interfaces/Counterparty";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { PayNote } from "@/types/interfaces/PayNote";

/**
 * Counterparties Page
 * Directory segmented by type (Customer/Vendor/Employee), aggregates per entity
 * Entities: Counterparty, Wallet, PayNote
 */
export default function CounterpartiesPage() {
  // TODO: Fetch from API
  const counterparties: Counterparty[] = [];
  const selectedType = "All";

  const filteredCounterparties =
    selectedType === "All"
      ? counterparties
      : counterparties.filter((cp) => cp.type === selectedType);

  const types = ["All", "Customer", "Vendor", "Employee", "Other"];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Counterparties</h1>
          <p className="text-muted-foreground mt-1">
            Manage your business relationships
          </p>
        </div>
        <Button variant="default">Add Counterparty</Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input placeholder="Search counterparties..." className="flex-1" />
          <select className="px-3 py-2 rounded-md border bg-background">
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Counterparties by Type */}
      <div className="grid gap-6">
        {["Customer", "Vendor", "Employee", "Other"].map((type) => {
          const typeCounterparties = counterparties.filter(
            (cp) => cp.type === type
          );

          if (typeCounterparties.length === 0 && selectedType !== "All")
            return null;

          return (
            <Card key={type} className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {type}s ({typeCounterparties.length})
              </h2>
              <div className="space-y-3">
                {typeCounterparties.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No {type.toLowerCase()}s yet
                  </p>
                ) : (
                  typeCounterparties.map((cp) => (
                    <div
                      key={cp.counterpartyId}
                      className="flex items-center justify-between border-b pb-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{cp.displayName}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          Wallet: {cp.walletId.slice(0, 16)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded bg-muted text-sm">
                          {cp.type}
                        </span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {types.slice(1).map((type) => (
          <Card key={type} className="p-4">
            <p className="text-sm text-muted-foreground">{type}s</p>
            <p className="text-2xl font-bold mt-1">
              {counterparties.filter((cp) => cp.type === type).length}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
