import { http } from "../lib/http";
import type { Organization } from "@/types/interfaces/Organization";
import type { Account } from "@/types/interfaces/Account";
import type { UUID } from "@/types/primitives/UUID";
import type { OrganizationCreate, OrganizationUpdate } from "../types/requests";

/**
 * Organizations API
 * Manage organizations (tenants) and members
 */
export const organizationsApi = {
  /**
   * List organizations for current user
   * GET /orgs
   */
  list: () => http.get<Organization[]>("/orgs"),

  /**
   * Create a new organization
   * POST /orgs
   */
  create: (data: OrganizationCreate) => http.post<Organization>("/orgs", data),

  /**
   * Get organization by ID
   * GET /orgs/{orgId}
   */
  get: (orgId: UUID) => http.get<Organization>(`/orgs/${orgId}`),

  /**
   * Update organization
   * PATCH /orgs/{orgId}
   */
  update: (orgId: UUID, data: OrganizationUpdate) =>
    http.patch<Organization>(`/orgs/${orgId}`, data),

  /**
   * Delete organization
   * DELETE /orgs/{orgId}
   */
  delete: (orgId: UUID) => http.delete<void>(`/orgs/${orgId}`),

  /**
   * List accounts (members) in organization
   * GET /orgs/{orgId}/accounts
   */
  listAccounts: (orgId: UUID) => http.get<Account[]>(`/orgs/${orgId}/accounts`),
};
