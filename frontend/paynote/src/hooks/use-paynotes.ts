import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";
import type { Status } from "@/types/enums/Status";
import type { UUID } from "@/types/primitives/UUID";
import type { Bytes32 } from "@/types/primitives/Bytes32";

export type PaynotesFilters = {
  orgId?: UUID | null;
  status?: Status | "All";
  search?: string;
  limit?: number;
};

const normalizeFilters = (filters: PaynotesFilters) => {
  const cleanSearch = filters.search?.trim() ?? "";
  return {
    orgId: filters.orgId ?? undefined,
    status:
      filters.status && filters.status !== "All" ? filters.status : undefined,
    search: cleanSearch.length ? cleanSearch : undefined,
    limit: filters.limit,
  };
};

const buildQueryKey = (filters: PaynotesFilters) => [
  "paynotes",
  normalizeFilters(filters),
];

export function usePaynotesQuery(filters: PaynotesFilters) {
  const normalized = useMemo(() => normalizeFilters(filters), [filters]);

  const query = useQuery({
    queryKey: buildQueryKey(filters),
    queryFn: async () => {
      if (!normalized.orgId) {
        return [] as PayNoteExpanded[];
      }

      return api.paynotes.list({
        orgId: normalized.orgId,
        status: normalized.status,
        search: normalized.search,
        limit: normalized.limit,
      });
    },
    enabled: Boolean(normalized.orgId),
    staleTime: 30_000,
  });

  return query;
}

export function useUpdatePaynoteReference(filters?: PaynotesFilters) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payNoteId,
      payReference,
      categoryId,
    }: {
      payNoteId: Bytes32;
      payReference: string | null;
      categoryId?: string | null;
    }) => api.paynotes.updateReference(payNoteId, payReference, categoryId),
    onSuccess: (updated) => {
      queryClient.setQueryData<PayNoteExpanded[] | undefined>(
        buildQueryKey(filters ?? {}),
        (existing) => {
          if (!existing) {
            return existing;
          }
          return existing.map((note) =>
            note.payNoteId === updated.payNoteId ? updated : note
          );
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["paynotes"],
      });
    },
  });
}
