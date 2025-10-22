import { http } from "../lib/http";
import type { Network } from "@/types/interfaces/Network";

/**
 * Networks API
 * Provides access to supported blockchain networks
 */
export const networksApi = {
  /**
   * List all supported networks
   * GET /networks
   */
  list: () => http.get<Network[]>("/networks"),
};
