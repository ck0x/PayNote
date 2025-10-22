import { http } from "../lib/http";
import type { Rule } from "@/types/interfaces/Rule";
import type { UUID } from "@/types/primitives/UUID";
import type { RuleCreate } from "../types/requests";

/**
 * Rules API
 * Manage automation rules for transaction categorization
 */
export const rulesApi = {
  /**
   * List rules for an organization
   * GET /orgs/{orgId}/rules
   */
  list: (orgId: UUID) => http.get<Rule[]>(`/orgs/${orgId}/rules`),

  /**
   * Create a new rule
   * POST /orgs/{orgId}/rules
   */
  create: (orgId: UUID, data: RuleCreate) =>
    http.post<Rule>(`/orgs/${orgId}/rules`, data),
};
