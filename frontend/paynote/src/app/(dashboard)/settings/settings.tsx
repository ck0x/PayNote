"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Organization } from "@/types/interfaces/Organization";
import type { Account } from "@/types/interfaces/Account";
import type { ContractBinding } from "@/types/interfaces/ContractBinding";

/**
 * Organization Settings Page
 * Org profile, members, billing, default currency, contract bindings
 * Entities: Organization, Account, ContractBinding
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "members" | "contracts" | "billing"
  >("general");

  // TODO: Fetch from API
  const organization: Organization | undefined = undefined;
  const members: Account[] = [];
  const contractBindings: ContractBinding[] = [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization profile and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { key: "general", label: "General" },
          { key: "members", label: "Members" },
          { key: "contracts", label: "Contracts" },
          { key: "billing", label: "Billing" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Organization Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Organization Name</label>
                <Input
                  defaultValue={organization?.name || ""}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  defaultValue={organization?.slug || ""}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used in URLs: paynote.app/org/{organization?.slug || "your-org"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Primary Currency</label>
                <select className="w-full px-3 py-2 rounded-md border bg-background mt-1">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <Button>Invite Member</Button>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              {members.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No members yet. Invite team members to collaborate.
                </p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.accountId}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-semibold">{member.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        defaultValue={member.role}
                        className="px-3 py-1 rounded-md border bg-background text-sm"
                      >
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Contracts Tab */}
      {activeTab === "contracts" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Contract Bindings</h2>
            <Button>Add Binding</Button>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              {contractBindings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No contract bindings configured. Add your PayNoteRegistry
                  contracts.
                </p>
              ) : (
                contractBindings.map((binding) => (
                  <div
                    key={binding.bindingId}
                    className="flex items-start justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-semibold">{binding.contractName}</p>
                      <p className="text-sm font-mono text-muted-foreground">
                        {binding.address}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Chain ID: {binding.chainId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {binding.verified && (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                          Verified
                        </span>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Billing Plan</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">
                    Current Plan: {organization?.billingPlan || "Free"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {organization?.billingPlan === "Free"
                      ? "Limited features"
                      : organization?.billingPlan === "Team"
                      ? "Up to 10 members"
                      : "Unlimited members and features"}
                  </p>
                </div>
                <Button variant="outline">Change Plan</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Billing History</h2>
            <p className="text-sm text-muted-foreground">
              No billing history available
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
