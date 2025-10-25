"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SearchIndex } from "@/types/interfaces/SearchIndex";
import type { PayNote } from "@/types/interfaces/PayNote";

/**
 * Search Page
 * Unified search across notes, wallets, categories; facets and saved views
 * Entities: SearchIndex, PayNote
 */
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");

  // TODO: Fetch from search API
  const searchResults: SearchIndex[] = [];

  const docTypes = ["All", "PayNote", "Wallet", "Counterparty", "Category"];

  const filteredResults =
    selectedType === "All"
      ? searchResults
      : searchResults.filter((r) => r.docType === selectedType);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground mt-1">
          Find transactions, wallets, categories, and more
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6">
        <div className="flex gap-4">
          <Input
            placeholder="Search by hash, address, reference, category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-lg"
          />
          <Button size="lg">Search</Button>
        </div>
      </Card>

      {/* Facets / Filters */}
      <div className="flex gap-2 flex-wrap">
        {docTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === type
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {query && (
        <div className="text-sm text-muted-foreground">
          {filteredResults.length} results for "{query}"
        </div>
      )}

      {/* Search Results */}
      <div className="grid gap-4">
        {!query ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Start typing to search across all your data
            </p>
          </Card>
        ) : filteredResults.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No results found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try different keywords or filters
            </p>
          </Card>
        ) : (
          filteredResults.map((result) => (
            <Card key={result.docId} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                      {result.docType}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ID: {result.docId.slice(0, 16)}...
                    </span>
                  </div>
                  <p className="text-sm mb-2">{result.terms}</p>
                  {result.orgId && (
                    <p className="text-xs text-muted-foreground">
                      Org: {result.orgId}
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Saved Searches (placeholder) */}
      {!query && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Saved Searches</h2>
          <p className="text-sm text-muted-foreground">
            No saved searches yet. Perform searches and save them for quick access.
          </p>
        </Card>
      )}

      {/* Recent Searches */}
      {!query && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your recent search history will appear here
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
