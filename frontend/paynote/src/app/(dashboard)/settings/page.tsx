"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrganization } from "@/context/organization-context";
import type { Account } from "@/types/interfaces/Account";
import type { ContractBinding } from "@/types/interfaces/ContractBinding";

/**
 * Organization Settings Page
 * Org profile, members, default currency, contract bindings
 * Entities: Organization, Account, ContractBinding
 */
export default function SettingsPage() {
  const { currentOrg, isLoading: orgLoading } = useOrganization();
  const [activeTab, setActiveTab] = useState<
    "general" | "members" | "contracts"
  >("general");
  const [members, setMembers] = useState<Account[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // TODO: Fetch contract bindings from API
  const contractBindings: ContractBinding[] = [];

  const fetchMembers = useCallback(async () => {
    if (!currentOrg) return;

    setIsLoadingMembers(true);
    try {
      const response = await fetch(`/api/orgs/${currentOrg.orgId}/accounts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("privy:token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMembers(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch members:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [currentOrg]);

  useEffect(() => {
    if (activeTab === "members" && currentOrg) {
      fetchMembers();
    }
  }, [activeTab, currentOrg, fetchMembers]);

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading organization...</p>
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No organization selected</p>
      </div>
    );
  }

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
          { key: "general" as const, label: "General" },
          { key: "members" as const, label: "Members" },
          { key: "contracts" as const, label: "Contracts" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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
                <Input defaultValue={currentOrg.name} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input defaultValue={currentOrg.slug} className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">
                  Used in URLs: paynote.app/org/
                  {currentOrg.slug}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Primary Currency</label>
                <select
                  className="w-full px-3 py-2 rounded-md border bg-background mt-1"
                  defaultValue={currentOrg.primaryCurrency}
                >
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
              {isLoadingMembers ? (
                <p className="text-muted-foreground text-center py-8">
                  Loading members...
                </p>
              ) : members.length === 0 ? (
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
    </div>
  );
}
