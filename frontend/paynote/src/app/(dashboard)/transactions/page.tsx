"use client";

import { useMemo, useState } from "react";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { ReferenceEditorDialog } from "@/components/transactions/reference-editor-dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  usePaynotesQuery,
  useUpdatePaynoteReference,
} from "@/hooks/use-paynotes";
import { useOrganization } from "@/context/organization-context";
import { useToast } from "@/components/ui/toast";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";

const STATUS_FILTERS = ["All", "Settled", "Pending", "Failed"] as const;

export default function TransactionsPage() {
  const { currentOrg, isLoading: orgLoading } = useOrganization();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [selectedNote, setSelectedNote] = useState<PayNoteExpanded | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filters = useMemo(
    () => ({
      orgId: currentOrg?.orgId,
      search,
      status,
      limit: 200,
    }),
    [currentOrg?.orgId, search, status]
  );

  const {
    data: paynotes,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePaynotesQuery(filters);

  const updateReference = useUpdatePaynoteReference(filters);

  const safePaynotes = Array.isArray(paynotes) ? paynotes : [];

  const handleEditReference = (note: PayNoteExpanded) => {
    setSelectedNote(note);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedNote(null);
    }
  };

  const handleReferenceSubmit = async (nextValue: string | null) => {
    if (!selectedNote) return;

    try {
      await updateReference.mutateAsync({
        payNoteId: selectedNote.payNoteId,
        payReference: nextValue,
      });
      toast({
        title: "Reference saved",
        description: nextValue
          ? "Payment reference updated successfully."
          : "Payment reference removed.",
      });
      setIsDialogOpen(false);
      setSelectedNote(null);
    } catch (mutationError) {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to update reference.";
      toast({
        title: "Unable to save reference",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (orgLoading && !currentOrg) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading your workspace...</p>
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold">No organization selected</h2>
          <p className="mt-2 text-muted-foreground">
            Create or select an organization from the sidebar to see
            transactions.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-4 pb-10 sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {currentOrg.name}
          </p>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Review on-chain activity, categorize spending, and keep every
            payment documented with references.
          </p>
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 gap-3">
              <Input
                placeholder="Search hash, wallet, or reference"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="flex-1"
              />
              <select
                className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as (typeof STATUS_FILTERS)[number]
                  )
                }
              >
                {STATUS_FILTERS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              {isFetching ? (
                <span className="text-xs text-muted-foreground">
                  Refreshing...
                </span>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                Refresh
              </Button>
            </div>
          </div>
          {error ? (
            <p className="mt-3 text-sm text-destructive">
              {(error as Error).message}
            </p>
          ) : null}
        </Card>

        <Card className="p-4">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
              Loading transactions...
            </div>
          ) : (
            <TransactionTable
              items={safePaynotes}
              onEditReference={handleEditReference}
            />
          )}
        </Card>
      </div>

      <ReferenceEditorDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        note={selectedNote}
        onSubmit={handleReferenceSubmit}
        isSubmitting={updateReference.isPending}
      />
    </>
  );
}
