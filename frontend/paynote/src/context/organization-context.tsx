"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { usePrivy } from "@privy-io/react-auth";
import { api } from "@/api";
import type { Organization } from "@/types/interfaces/Organization";
import type { Account } from "@/types/interfaces/Account";
import type { UUID } from "@/types/primitives/UUID";
import { useAuth } from "./auth-context";

interface OrganizationContextValue {
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization | null) => void;
  currentAccount: Account | null;
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  isOwner: () => boolean;
  isAdmin: () => boolean;
  canManageMembers: () => boolean;
  canManageSettings: () => boolean;
  switchOrganization: (orgId: UUID) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(
  undefined
);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { authenticated, user } = usePrivy();
  const { account: authAccount, isLoading: authLoading } = useAuth();
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const switchOrganization = useCallback(
    async (orgId: UUID) => {
      try {
        setError(null);

        const org = await api.organizations.get(orgId);
        setCurrentOrg(org);

        const accountsResponse = await api.organizations.listAccounts(orgId);
        const accounts = Array.isArray(accountsResponse)
          ? accountsResponse
          : [];
        const userAccount = accounts.find(
          (acc) => acc.email === user?.email?.address
        );
        setCurrentAccount(userAccount || null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to switch organization"
        );
        console.error("Failed to switch organization:", err);
      }
    },
    [user]
  );

  // Fetch organizations and set initial org
  useEffect(() => {
    if (!authenticated || !user || !authAccount || authLoading) {
      setIsLoading(false);
      return;
    }

    async function fetchOrganizations() {
      try {
        setIsLoading(true);
        setError(null);
        const orgsResponse = await api.organizations.list();

        const organisations = Array.isArray(orgsResponse) ? orgsResponse : [];
        setOrganizations(organisations);

        const initialOrg = organisations[0] || null;

        if (initialOrg) {
          await switchOrganization(initialOrg.orgId);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load organizations"
        );
        console.error("Failed to fetch organizations:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrganizations();
  }, [authenticated, user, authAccount, authLoading, switchOrganization]);

  const refreshOrganizations = useCallback(async () => {
    if (!authenticated || !user || !authAccount) return;

    try {
      setError(null);
      const orgsResponse = await api.organizations.list();
      const organisations = Array.isArray(orgsResponse) ? orgsResponse : [];
      setOrganizations(organisations);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load organizations"
      );
      console.error("Failed to refresh organizations:", err);
    }
  }, [authenticated, user, authAccount]);

  const isOwner = () => currentAccount?.role === "Owner";
  const isAdmin = () =>
    currentAccount?.role === "Owner" || currentAccount?.role === "Admin";
  const canManageMembers = () => isAdmin();
  const canManageSettings = () => isOwner(); // Only owners can change org settings

  const value: OrganizationContextValue = {
    currentOrg,
    setCurrentOrg,
    currentAccount,
    organizations,
    isLoading,
    error,
    isOwner,
    isAdmin,
    canManageMembers,
    canManageSettings,
    switchOrganization,
    refreshOrganizations,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return context;
}
