"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronsUpDown, Check, Loader2, Plus } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UUID } from "@/types/primitives/UUID";
import { useOrganization } from "@/context/organization-context";
import { cn } from "@/lib/utils";
import { CreateOrganizationModal } from "@/components/organization/create-organization-modal";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success" };

export default function OrganizationSwitcher() {
  const {
    currentOrg,
    switchOrganization,
    organizations: contextOrganizations,
    refreshOrganizations,
  } = useOrganization();
  const { authenticated, login } = usePrivy();
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [activeOrgId, setActiveOrgId] = useState<UUID | null>(null);

  // Use organizations from context instead of local state
  const organizations = contextOrganizations;

  const handleOrganizationCreated = async () => {
    // Refresh the organizations list from context
    try {
      await refreshOrganizations();
      setFetchState({ status: "success" });
    } catch (error) {
      setFetchState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to refresh organizations",
      });
    }
  };

  useEffect(() => {
    if (!authenticated) {
      setFetchState({ status: "success" });
      return;
    }

    setFetchState({ status: "success" });
  }, [authenticated]);

  useEffect(() => {
    if (currentOrg) {
      setActiveOrgId(currentOrg.orgId);
    }
  }, [currentOrg]);

  const handleSelect = async (orgId: UUID) => {
    if (orgId === activeOrgId) return;
    setActiveOrgId(orgId);
    try {
      await switchOrganization(orgId);
    } catch (error) {
      console.error("Failed to switch organization", error);
    }
  };

  const renderTriggerLabel = useMemo(() => {
    if (fetchState.status === "loading") {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading organizations
        </div>
      );
    }

    if (fetchState.status === "error") {
      return (
        <div className="text-sm text-destructive">
          {fetchState.message || "Failed to load organizations"}
        </div>
      );
    }

    if (!organizations.length) {
      return (
        <div className="text-sm text-muted-foreground">
          No organizations found
        </div>
      );
    }

    return (
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold text-foreground">
          {currentOrg?.name ?? "Select organization"}
        </span>
        <span className="text-xs text-muted-foreground">
          {currentOrg?.slug ?? "Choose an organization"}
        </span>
      </div>
    );
  }, [fetchState, organizations.length, currentOrg?.name, currentOrg?.slug]);

  // If not authenticated, show sign-in button
  if (!authenticated) {
    return (
      <Button
        variant="default"
        size="sm"
        className="mt-4 w-full justify-center"
        onClick={login}
      >
        Sign In
      </Button>
    );
  }

  if (fetchState.status === "error") {
    return (
      <div className="mt-4 space-y-2">
        <p className="text-xs text-destructive">
          {fetchState.message || "Unable to load organizations"}
        </p>
        <CreateOrganizationModal onSuccess={handleOrganizationCreated} />
      </div>
    );
  }

  if (fetchState.status !== "loading" && !organizations.length) {
    return (
      <div className="mt-4">
        <CreateOrganizationModal onSuccess={handleOrganizationCreated} />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full justify-between"
          disabled={fetchState.status === "loading"}
        >
          {renderTriggerLabel}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Select an organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.orgId}
            onClick={() => handleSelect(org.orgId)}
            className="flex items-center gap-2"
          >
            <Check
              className={cn(
                "size-4 text-muted-foreground",
                org.orgId === activeOrgId ? "opacity-100" : "opacity-0"
              )}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{org.name}</span>
              <span className="text-xs text-muted-foreground">{org.slug}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <CreateOrganizationModal
          onSuccess={handleOrganizationCreated}
          trigger={
            <button className="flex w-full items-center px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
              <Plus className="mr-2 size-4" />
              Create organization
            </button>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
