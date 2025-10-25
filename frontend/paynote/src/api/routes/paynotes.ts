import { http } from "../lib/http";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";
import type { UUID } from "@/types/primitives/UUID";
import type { ChainId } from "@/types/primitives/ChainId";
import type { Address } from "@/types/primitives/Address";
import type { Bytes32 } from "@/types/primitives/Bytes32";

/**
 * PayNotes API query parameters
 */
interface PayNotesQueryParams {
  chainId?: ChainId;
  address?: Address;
  categoryId?: UUID;
  orgId?: UUID;
}

/**
 * PayNotes (Transactions) API
 * Access on-chain payment transactions with references
 */
export const paynotesApi = {
  /**
   * List paynotes with optional filters (public explore)
   * GET /paynotes
   */
  list: (params?: PayNotesQueryParams) =>
    http.get<PayNoteExpanded[]>("/paynotes", { params: params as any }),

  /**
   * Get paynote by ID
   * GET /paynotes/{payNoteId}
   */
  get: (payNoteId: Bytes32) =>
    http.get<PayNoteExpanded>(`/paynotes/${payNoteId}`),
};
