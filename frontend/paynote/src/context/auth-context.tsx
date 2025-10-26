"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { UUID } from "@/types/primitives/UUID";
import type { ProblemDetail } from "@/types/interfaces/ProblemDetail";
import { setTokenProvider } from "@/api/lib/http";

interface AuthState {
  account: Account | null;
  organizations: Organization[];
  selectedOrgId: UUID | null;
  wallets: Wallet[];
  isLoading: boolean;
  error: string | null;
}

interface RegisterLoginPayload {
  privyUserId?: string;
  email?: string;
  walletAddress?: string;
  authMethod: string;
}

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    authenticated,
    ready,
    user,
    logout: privyLogout,
    getAccessToken,
  } = usePrivy();

  useEffect(() => {
    setTokenProvider(async () => {
      try {
        return await getAccessToken();
      } catch (error) {
        console.error("Failed to get Privy access token:", error);
        return null;
      }
    });
  }, [getAccessToken]);

  const [state, setState] = useState<AuthState>({
    account: null,
    organizations: [],
    selectedOrgId: null,
    wallets: [],
    isLoading: true,
    error: null,
  });

  const registerOrLogin = async (payload: RegisterLoginPayload) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    type AuthResponsePayload = {
      account: Account;
      organization?: Organization;
      organizations?: Organization[];
      wallet?: Wallet;
      wallets?: Wallet[];
    };

    const applyAuthPayload = (authPayload: AuthResponsePayload) => {
      const organizations = authPayload.organizations?.length
        ? authPayload.organizations
        : authPayload.organization
        ? [authPayload.organization]
        : [];

      const wallets = authPayload.wallets?.length
        ? authPayload.wallets
        : authPayload.wallet
        ? [authPayload.wallet]
        : [];

      const selectedOrgId =
        state.selectedOrgId &&
        organizations.some((org) => org.orgId === state.selectedOrgId)
          ? state.selectedOrgId
          : organizations[0]?.orgId || null;

      if (selectedOrgId) {
        localStorage.setItem("selectedOrgId", selectedOrgId);
      } else {
        localStorage.removeItem("selectedOrgId");
      }

      setState({
        account: authPayload.account,
        organizations,
        selectedOrgId,
        wallets,
        isLoading: false,
        error: null,
      });
    };

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("Missing Privy access token. Please log in again.");
      }

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (loginResponse.ok) {
        const loginBody = (await loginResponse
          .json()
          .catch(() => null)) as unknown;

        if (!hasAccountPayload(loginBody)) {
          throw new Error("Unexpected response from server");
        }

        applyAuthPayload(loginBody as AuthResponsePayload);
        return;
      }

      if (loginResponse.status !== 404) {
        const loginBody = (await loginResponse
          .json()
          .catch(() => null)) as unknown;
        throw new Error(extractProblemDetail(loginBody) || "Failed to login");
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
        throw new Error(
          extractProblemDetail(responseBody) || "Failed to register/login"
        );
      }

      if (!hasAccountPayload(responseBody)) {
        throw new Error("Unexpected response from server");
      }

      applyAuthPayload(responseBody as AuthResponsePayload);
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
        const email = user.email?.address;
        const walletAddress = user.wallet?.address;
        const isWalletAuth = !email && walletAddress;

        await registerOrLogin({
          privyUserId: user.id,
          email,
          walletAddress: isWalletAuth ? walletAddress : undefined,
          authMethod: isWalletAuth ? "wallet" : "email",
        });
        return;
      }

      const responseBody = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        throw new Error(
          extractProblemDetail(responseBody) || "Failed to fetch user data"
        );
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
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to load user data",
      }));
    }
  };

  const selectOrganization = (orgId: UUID) => {
    setState((prev) => ({ ...prev, selectedOrgId: orgId }));
    localStorage.setItem("selectedOrgId", orgId);
  };

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

  useEffect(() => {
    if (ready && authenticated && user) {
      refreshAuth();
    } else if (ready && !authenticated) {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useSelectedOrg() {
  const { organizations, selectedOrgId } = useAuth();
  return organizations.find((org) => org.orgId === selectedOrgId);
}
