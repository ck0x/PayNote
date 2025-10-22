"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { UUID } from "@/types/primitives/UUID";

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
  privyUserId: string;
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

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { authenticated, ready, user, logout: privyLogout } = usePrivy();
  
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
      // Call backend API to register/login
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to register/login");
      }

      const data = await response.json();

      setState({
        account: data.account,
        organizations: data.organizations || [],
        selectedOrgId: data.organizations?.[0]?.orgId || null,
        wallets: data.wallets || [],
        isLoading: false,
        error: null,
      });

      // Store selected org in localStorage
      if (data.organizations?.[0]?.orgId) {
        localStorage.setItem("selectedOrgId", data.organizations[0].orgId);
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
      const response = await fetch("/api/auth/me");
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      // Restore selected org from localStorage or use first org
      const storedOrgId = localStorage.getItem("selectedOrgId");
      const selectedOrgId = storedOrgId || data.organizations?.[0]?.orgId || null;

      setState({
        account: data.account,
        organizations: data.organizations || [],
        selectedOrgId,
        wallets: data.wallets || [],
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
