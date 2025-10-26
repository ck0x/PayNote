import { http } from "../lib/http";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";
import type { UUID } from "@/types/primitives/UUID";
import type { ChainId } from "@/types/primitives/ChainId";
import type { Address } from "@/types/primitives/Address";
import type { Bytes32 } from "@/types/primitives/Bytes32";
import type { Status } from "@/types/enums/Status";

/**
 * PayNotes API query parameters
 */
interface PayNotesQueryParams {
  chainId?: ChainId;
  address?: Address;
  categoryId?: UUID;
  orgId?: UUID;
  status?: Status;
  search?: string;
  limit?: number;
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

  /**
   * Update payment reference
   * PATCH /paynotes/{payNoteId}
   */
  updateReference: (payNoteId: Bytes32, payReference: string | null) =>
    http.patch<PayNoteExpanded>(`/paynotes/${payNoteId}`, {
      payReference,
    }),
};
