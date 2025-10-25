import { http } from "../lib/http";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { UUID } from "@/types/primitives/UUID";
import type { Address } from "@/types/primitives/Address";

/**
 * Wallets API query parameters
 */
interface WalletsQueryParams {
  ownerAccountId?: UUID;
  address?: Address;
}

/**
 * Wallets API
 * Manage wallet addresses and ENS names
 */
export const walletsApi = {
  /**
   * List wallets with optional filters
   * GET /wallets
   */
  list: (params?: WalletsQueryParams) =>
    http.get<Wallet[]>("/wallets", { params: params as any }),
};
