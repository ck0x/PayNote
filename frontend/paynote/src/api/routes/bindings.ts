import { http } from "../lib/http";
import type { ContractBinding } from "@/types/interfaces/ContractBinding";
import type { UUID } from "@/types/primitives/UUID";
import type { ChainId } from "@/types/primitives/ChainId";

/**
 * Contract bindings API query parameters
 */
interface BindingsQueryParams {
  chainId?: ChainId;
  orgId?: UUID;
}

/**
 * Contract Bindings API
 * Access PayNoteRegistry contract addresses per network
 */
export const bindingsApi = {
  /**
   * List contract bindings with optional filters
   * GET /bindings
   */
  list: (params?: BindingsQueryParams) =>
    http.get<ContractBinding[]>("/bindings", { params: params as any }),
};
