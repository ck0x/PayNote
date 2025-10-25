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
  refreshOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(
  undefined
);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { authenticated, user } = usePrivy();
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

        const accounts = await api.organizations.listAccounts(orgId);
        const userAccount = accounts.find(
          (acc) => acc.email === user?.email?.address
        );
        setCurrentAccount(userAccount || null);

        // Save to localStorage, in lieu of database persistence
        localStorage.setItem("currentOrgId", orgId);
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
    if (!authenticated || !user) {
      setIsLoading(false);
      return;
    }

    async function fetchOrganizations() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all orgs the user belongs to
        const orgsResponse = await api.organizations.list();

        // Ensure we have an array
        const organisations = Array.isArray(orgsResponse) ? orgsResponse : [];
        setOrganizations(organisations);

        // Set first org as current (or retrieve from localStorage)
        const savedOrgId = localStorage.getItem("currentOrgId");
        const initialOrg =
          organisations.find((o) => o.orgId === savedOrgId) ||
          organisations[0] ||
          null;

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
  }, [authenticated, user, switchOrganization]);

  // Refresh current organization data
  async function refreshOrganization() {
    if (!currentOrg) return;
    await switchOrganization(currentOrg.orgId);
  }

  // Permission helpers
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
    refreshOrganization,
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
