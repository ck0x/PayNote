"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types/interfaces/Category";
import type { Rule } from "@/types/interfaces/Rule";
import type { PayNote } from "@/types/interfaces/PayNote";

/**
 * Categories & Rules Page
 * Manage taxonomy and auto-tagging rules (preview which PayNotes match)
 * Entities: Category, Rule, PayNote
 */
export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "rules">(
    "categories"
  );

  // TODO: Fetch from API
  const categories: Category[] = [];
  const rules: Rule[] = [];
  const matchingPayNotes: PayNote[] = [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories & Rules</h1>
          <p className="text-muted-foreground mt-1">
            Organize and automate transaction categorization
          </p>
        </div>
        <Button variant="default">
          {activeTab === "categories" ? "Add Category" : "Add Rule"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "rules"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Rules
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <Card className="p-4">
            <Input placeholder="Search categories..." />
          </Card>

          <div className="grid gap-4">
            {categories.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No categories yet. Create your first category to start
                  organizing transactions.
                </p>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category.categoryId} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: category.color + "33" }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.visibility} • Org ID: {category.orgId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === "rules" && (
        <div className="space-y-4">
          <Card className="p-4">
            <Input placeholder="Search rules..." />
          </Card>

          <div className="grid gap-4">
            {rules.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No rules yet. Create automation rules to categorize
                  transactions automatically.
                </p>
              </Card>
            ) : (
              rules.map((rule) => (
                <Card key={rule.ruleId} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            rule.enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {rule.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Org ID: {rule.orgId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Preview Matches
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        {rule.enabled ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Categories</p>
          <p className="text-2xl font-bold mt-1">{categories.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Rules</p>
          <p className="text-2xl font-bold mt-1">
            {rules.filter((r) => r.enabled).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Auto-Tagged Today</p>
          <p className="text-2xl font-bold mt-1">0</p>
        </Card>
      </div>
    </div>
  );
}
