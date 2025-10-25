import { http } from "../lib/http";

/**
 * Aggregates API
 * Client wrapper for the public aggregates endpoint
 */
export const aggregatesApi = {
  /**
   * Fetch aggregated mock data
   * GET /api/aggregates
   */
  fetch: () => http.get("/aggregates"),
};
