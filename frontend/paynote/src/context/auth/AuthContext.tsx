"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";
import { AuthState, initialAuthState, AUTH_STORAGE_KEYS } from "./types";

/**
 * Auth context value
 */
interface AuthContextValue extends AuthState {
  register: (data: {
    privyUserId: string;
    email?: string;
    walletAddress?: string;
    displayName?: string;
  }) => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setSelectedOrg: (orgId: string) => void;
  getSelectedOrg: () => Organization | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, authenticated, ready, getAccessToken, logout: privyLogout } = usePrivy();
  const [state, setState] = useState<AuthState>(initialAuthState);

  /**
   * Load auth state from localStorage on mount
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedAccount = localStorage.getItem(AUTH_STORAGE_KEYS.ACCOUNT);
      const storedOrgs = localStorage.getItem(AUTH_STORAGE_KEYS.ORGANIZATIONS);
      const storedOrgId = localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_ORG_ID);
      const storedWallets = localStorage.getItem(AUTH_STORAGE_KEYS.WALLETS);

      if (storedAccount) {
        setState({
          account: JSON.parse(storedAccount),
          organizations: storedOrgs ? JSON.parse(storedOrgs) : [],
          wallets: storedWallets ? JSON.parse(storedWallets) : [],
          selectedOrgId: storedOrgId,
          isLoading: false,
          error: null,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Failed to load auth state from storage:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Save auth state to localStorage
   */
  const saveToStorage = (
    account: Account | null,
    organizations: Organization[],
    wallets: Wallet[],
    selectedOrgId: string | null
  ) => {
    if (typeof window === "undefined") return;

    try {
      if (account) {
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCOUNT, JSON.stringify(account));
        localStorage.setItem(AUTH_STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(organizations));
        localStorage.setItem(AUTH_STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
        if (selectedOrgId) {
          localStorage.setItem(AUTH_STORAGE_KEYS.SELECTED_ORG_ID, selectedOrgId);
        }
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEYS.ACCOUNT);
        localStorage.removeItem(AUTH_STORAGE_KEYS.ORGANIZATIONS);
        localStorage.removeItem(AUTH_STORAGE_KEYS.SELECTED_ORG_ID);
        localStorage.removeItem(AUTH_STORAGE_KEYS.WALLETS);
      }
    } catch (error) {
      console.error("Failed to save auth state to storage:", error);
    }
  };

  /**
   * Register new user
   */
  const register = async (data: {
    privyUserId: string;
    email?: string;
    walletAddress?: string;
    displayName?: string;
  }) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const token = await getAccessToken();
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }

      const result = await response.json();
      const { account, organization, wallet } = result;

      const organizations = [organization];
      const wallets = wallet ? [wallet] : [];
      const selectedOrgId = organization.orgId;

      setState({
        account,
        organizations,
        wallets,
        selectedOrgId,
        isLoading: false,
        error: null,
      });

      saveToStorage(account, organizations, wallets, selectedOrgId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  /**
   * Login existing user
   */
  const login = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const token = await getAccessToken();
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const result = await response.json();
      const { account, organizations, wallets } = result;

      const selectedOrgId = account.orgId || organizations[0]?.orgId || null;

      setState({
        account,
        organizations,
        wallets,
        selectedOrgId,
        isLoading: false,
        error: null,
      });

      saveToStorage(account, organizations, wallets, selectedOrgId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await privyLogout();
      setState(initialAuthState);
      saveToStorage(null, [], [], null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const token = await getAccessToken();
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const result = await response.json();
      const { account, organizations, wallets } = result;

      setState((prev) => ({
        ...prev,
        account,
        organizations,
        wallets,
        isLoading: false,
        error: null,
      }));

      saveToStorage(account, organizations, wallets, state.selectedOrgId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to refresh user";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  };

  /**
   * Set selected organization
   */
  const setSelectedOrg = (orgId: string) => {
    setState((prev) => ({ ...prev, selectedOrgId: orgId }));
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEYS.SELECTED_ORG_ID, orgId);
    }
  };

  /**
   * Get currently selected organization
   */
  const getSelectedOrg = (): Organization | null => {
    if (!state.selectedOrgId) return null;
    return state.organizations.find((org) => org.orgId === state.selectedOrgId) || null;
  };

  /**
   * Auto-login when Privy authenticates
   */
  useEffect(() => {
    if (ready && authenticated && user && !state.account) {
      // User is authenticated with Privy but not in our system
      // This will be handled by the OAuth/Wallet components
      setState((prev) => ({ ...prev, isLoading: false }));
    } else if (ready && !authenticated) {
      // User logged out of Privy
      if (state.account) {
        logout();
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  }, [ready, authenticated, user, state.account]);

  const value: AuthContextValue = {
    ...state,
    register,
    login,
    logout,
    refreshUser,
    setSelectedOrg,
    getSelectedOrg,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
