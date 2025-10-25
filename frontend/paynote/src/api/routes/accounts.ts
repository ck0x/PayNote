import { http } from "../lib/http";
import type { Account } from "@/types/interfaces/Account";
import type { UUID } from "@/types/primitives/UUID";
import type { Role } from "@/types/enums/Role";

interface AccountCreateRequest {
  email: string;
  role: Role;
  displayName?: string;
}

interface AccountUpdateRequest {
  role?: Role;
  displayName?: string;
  defaultWalletId?: UUID | null;
}

/**
 * Accounts API
 * Manage organization members (accounts)
 */
export const accountsApi = {
  /**
   * Create a new account (invite member to organization)
   * POST /orgs/{orgId}/accounts
   */
  create: (orgId: UUID, data: AccountCreateRequest) =>
    http.post<Account>(`/orgs/${orgId}/accounts`, data),

  /**
   * Update account details
   * PATCH /accounts/{accountId}
   */
  update: (accountId: UUID, data: AccountUpdateRequest) =>
    http.patch<Account>(`/accounts/${accountId}`, data),

  /**
   * Delete account (remove member from organization)
   * DELETE /accounts/{accountId}
   */
  delete: (accountId: UUID) => http.delete<void>(`/accounts/${accountId}`),

  /**
   * Get account by ID
   * GET /accounts/{accountId}
   */
  get: (accountId: UUID) => http.get<Account>(`/accounts/${accountId}`),
};
