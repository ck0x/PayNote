import { http } from "../lib/http";
import type { Counterparty } from "@/types/interfaces/Counterparty";
import type { UUID } from "@/types/primitives/UUID";
import type { CPType } from "@/types/enums/CPType";

/**
 * Counterparties API query parameters
 */
interface CounterpartiesQueryParams {
  type?: CPType;
}

/**
 * Counterparties API
 * Manage business relationships (customers, vendors, employees)
 */
export const counterpartiesApi = {
  /**
   * List counterparties for an organization
   * GET /orgs/{orgId}/counterparties
   */
  list: (orgId: UUID, params?: CounterpartiesQueryParams) =>
    http.get<Counterparty[]>(`/orgs/${orgId}/counterparties`, { params: params as any }),
};
