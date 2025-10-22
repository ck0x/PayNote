import { http } from "../lib/http";
import type { Category } from "@/types/interfaces/Category";
import type { UUID } from "@/types/primitives/UUID";
import type { CategoryCreate } from "../types/requests";

/**
 * Categories API
 * Manage transaction categories and taxonomy
 */
export const categoriesApi = {
  /**
   * List categories for an organization
   * GET /orgs/{orgId}/categories
   */
  list: (orgId: UUID) =>
    http.get<Category[]>(`/orgs/${orgId}/categories`),

  /**
   * Create a new category
   * POST /orgs/{orgId}/categories
   */
  create: (orgId: UUID, data: CategoryCreate) =>
    http.post<Category>(`/orgs/${orgId}/categories`, data),
};
