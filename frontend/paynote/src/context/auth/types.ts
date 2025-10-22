import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";

/**
 * Authentication state
 */
export interface AuthState {
  account: Account | null;
  organizations: Organization[];
  wallets: Wallet[];
  selectedOrgId: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial auth state
 */
export const initialAuthState: AuthState = {
  account: null,
  organizations: [],
  wallets: [],
  selectedOrgId: null,
  isLoading: true,
  error: null,
};

/**
 * Local storage keys
 */
export const AUTH_STORAGE_KEYS = {
  ACCOUNT: "paynote_account",
  ORGANIZATIONS: "paynote_organizations",
  SELECTED_ORG_ID: "paynote_selected_org_id",
  WALLETS: "paynote_wallets",
} as const;
