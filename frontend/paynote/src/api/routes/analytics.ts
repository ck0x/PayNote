import { http } from "../lib/http";
import type { AnalyticsDaily } from "@/types/interfaces/AnalyticsDaily";
import type { UUID } from "@/types/primitives/UUID";
import type { ChainId } from "@/types/primitives/ChainId";

/**
 * Analytics API query parameters
 */
interface AnalyticsDailyParams {
  orgId: UUID;
  from?: string; // ISO date (YYYY-MM-DD)
  to?: string; // ISO date (YYYY-MM-DD)
  chainId?: ChainId;
}

/**
 * Analytics API
 * Access pre-aggregated transaction metrics
 */
export const analyticsApi = {
  /**
   * Get daily analytics aggregates
   * GET /analytics/daily
   */
  daily: (params: AnalyticsDailyParams) =>
    http.get<AnalyticsDaily[]>("/analytics/daily", { params: params as any }),
};
