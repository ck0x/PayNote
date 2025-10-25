import { http } from "../lib/http";
import type { SearchIndex } from "@/types/interfaces/SearchIndex";
import type { UUID } from "@/types/primitives/UUID";
import type { DocType } from "@/types/enums/DocType";

/**
 * Search API query parameters
 */
interface SearchParams {
  q: string; // Query string
  orgId?: UUID;
  docType?: DocType;
}

/**
 * Search API
 * Unified search across all document types
 */
export const searchApi = {
  /**
   * Search across documents
   * GET /search
   */
  search: (params: SearchParams) =>
    http.get<SearchIndex[]>("/search", { params: params as any }),
};
