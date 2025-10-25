"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Check, Plus, Loader2 } from "lucide-react";
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
import { api } from "@/api";
import type { Organization } from "@/types/interfaces/Organization";
import type { UUID } from "@/types/primitives/UUID";
import { useOrganization } from "@/context/organization-context";
import { cn } from "@/lib/utils";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success" };

export default function OrganizationSwitcher() {
  const router = useRouter();
  const { currentOrg, switchOrganization } = useOrganization();
  const { authenticated } = usePrivy();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [activeOrgId, setActiveOrgId] = useState<UUID | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!authenticated) {
      setOrganizations([]);
      setFetchState({ status: "success" });
      return () => {
        isMounted = false;
      };
    }

    setFetchState({ status: "loading" });

    api.organizations
      .list()
      .then((data) => {
        if (!isMounted) return;
        setOrganizations(Array.isArray(data) ? data : []);
        setFetchState({ status: "success" });
      })
      .catch((error) => {
        if (!isMounted) return;
        const message =
          error instanceof Error ? error.message : "Failed to load organizations";
        setFetchState({ status: "error", message });
      });

    return () => {
      isMounted = false;
    };
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

  if (fetchState.status === "error") {
    return (
      <div className="mt-4 space-y-2">
        <p className="text-xs text-destructive">
          {fetchState.message || "Unable to load organizations"}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center"
          onClick={() => router.push("/settings?screen=organization")}
        >
          <Plus className="mr-2 size-4" />
          Create organization
        </Button>
      </div>
    );
  }

  if (fetchState.status !== "loading" && !organizations.length) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full justify-center"
        onClick={() => router.push("/settings?screen=organization")}
      >
        <Plus className="mr-2 size-4" />
        Create organization
      </Button>
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
        <DropdownMenuItem
          onClick={() => router.push("/settings?screen=organization")}
        >
          <Plus className="mr-2 size-4" />
          Create organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
