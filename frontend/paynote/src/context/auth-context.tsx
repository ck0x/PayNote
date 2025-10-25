"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { UUID } from "@/types/primitives/UUID";
import type { ProblemDetail } from "@/types/interfaces/ProblemDetail";

/**
 * Authentication state interface
 */
interface AuthState {
  account: Account | null;
  organizations: Organization[];
  selectedOrgId: UUID | null;
  wallets: Wallet[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Registration/Login payload
 */
interface RegisterLoginPayload {
  privyUserId?: string;
  email?: string;
  walletAddress?: string;
  authMethod: string;
}

/**
 * Authentication context interface
 */
interface AuthContextValue extends AuthState {
  registerOrLogin: (payload: RegisterLoginPayload) => Promise<void>;
  selectOrganization: (orgId: UUID) => void;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function extractProblemDetail(body: unknown): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  if (!("detail" in body)) {
    return undefined;
  }

  const value = (body as Partial<ProblemDetail>).detail;
  return typeof value === "string" ? value : undefined;
}

function hasAccountPayload(body: unknown): body is { account: Account } {
  return Boolean(
    body &&
      typeof body === "object" &&
      "account" in body &&
      typeof (body as { account?: unknown }).account === "object" &&
      (body as { account?: Account }).account !== null
  );
}

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { authenticated, ready, user, logout: privyLogout, getAccessToken } = usePrivy();
  
  const [state, setState] = useState<AuthState>({
    account: null,
    organizations: [],
    selectedOrgId: null,
    wallets: [],
    isLoading: true,
    error: null,
  });

  /**
   * Register or login user with backend
  */
  const registerOrLogin = async (payload: RegisterLoginPayload) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("Missing Privy access token. Please log in again.");
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...payload,
          privyUserId: payload.privyUserId ?? user?.id ?? undefined,
        }),
      });

      const responseBody = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        throw new Error(extractProblemDetail(responseBody) || "Failed to register/login");
      }

      if (!hasAccountPayload(responseBody)) {
        throw new Error("Unexpected response from server");
      }

      type RegisterApiResponse = {
        account: Account;
        organization?: Organization;
        organizations?: Organization[];
        wallet?: Wallet;
        wallets?: Wallet[];
      };

      const registerPayload = responseBody as RegisterApiResponse;

      const organizations =
        registerPayload.organizations?.length
          ? registerPayload.organizations
          : registerPayload.organization
            ? [registerPayload.organization]
            : [];

      const wallets =
        registerPayload.wallets?.length
          ? registerPayload.wallets
          : registerPayload.wallet
            ? [registerPayload.wallet]
            : [];

      setState({
        account: registerPayload.account,
        organizations,
        selectedOrgId: organizations[0]?.orgId || null,
        wallets,
        isLoading: false,
        error: null,
      });

      if (organizations[0]?.orgId) {
        localStorage.setItem("selectedOrgId", organizations[0].orgId);
      }
    } catch (error) {
      console.error("Register/login error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      }));
      throw error;
    }
  };

  /**
   * Refresh authentication state
   */
  const refreshAuth = async () => {
    if (!authenticated || !user) {
      setState({
        account: null,
        organizations: [],
        selectedOrgId: null,
        wallets: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("Missing Privy access token. Please log in again.");
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 404) {
        setState({
          account: null,
          organizations: [],
          selectedOrgId: null,
          wallets: [],
          isLoading: false,
          error: null,
        });
        return;
      }

      const responseBody = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        throw new Error(extractProblemDetail(responseBody) || "Failed to fetch user data");
      }

      if (!hasAccountPayload(responseBody)) {
        throw new Error("Unexpected response from server");
      }

      type MeApiResponse = {
        account: Account;
        organizations?: Organization[];
        wallets?: Wallet[];
      };

      const mePayload = responseBody as MeApiResponse;

      const organizations = mePayload.organizations || [];
      const wallets = mePayload.wallets || [];

      const storedOrgId = localStorage.getItem("selectedOrgId");
      const selectedOrgId = storedOrgId || organizations[0]?.orgId || null;

      setState({
        account: mePayload.account,
        organizations,
        selectedOrgId,
        wallets,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Refresh auth error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load user data",
      }));
    }
  };

  /**
   * Select organization
   */
  const selectOrganization = (orgId: UUID) => {
    setState((prev) => ({ ...prev, selectedOrgId: orgId }));
    localStorage.setItem("selectedOrgId", orgId);
  };

  /**
   * Logout user
   */
  const logout = async () => {
    await privyLogout();
    setState({
      account: null,
      organizations: [],
      selectedOrgId: null,
      wallets: [],
      isLoading: false,
      error: null,
    });
    localStorage.removeItem("selectedOrgId");
  };

  /**
   * Initialize auth state when Privy is ready
   */
  useEffect(() => {
    if (ready && authenticated && user) {
      refreshAuth();
    } else if (ready && !authenticated) {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [ready, authenticated, user?.id]);

  const value: AuthContextValue = {
    ...state,
    registerOrLogin,
    selectOrganization,
    refreshAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

/**
 * Hook to get selected organization
 */
export function useSelectedOrg() {
  const { organizations, selectedOrgId } = useAuth();
  return organizations.find((org) => org.orgId === selectedOrgId);
}
