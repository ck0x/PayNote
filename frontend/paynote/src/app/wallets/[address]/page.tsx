"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { PayNote } from "@/types/interfaces/PayNote";
import type { Counterparty } from "@/types/interfaces/Counterparty";

/**
 * Wallet Detail Page
 * All PayNotes sent/received by address; label, ENS, counterparty profile
 * Entities: Wallet, PayNote, Counterparty
 */
export default function WalletDetailPage({
  params,
}: {
  params: { address: string };
}) {
  // TODO: Fetch wallet and related data
  const wallet: Wallet | undefined = undefined;
  const counterparty: Counterparty | undefined = undefined;
  const sentPayNotes: PayNote[] = [];
  const receivedPayNotes: PayNote[] = [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wallet Details</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            {params.address}
          </p>
          {wallet?.ensName && (
            <p className="text-sm text-muted-foreground mt-1">
              ENS: {wallet.ensName}
            </p>
          )}
        </div>
        <Button variant="outline">View on Explorer</Button>
      </div>

      {/* Wallet Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Label</p>
            <p className="mt-1">{wallet?.label || "No label"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="mt-1">
              {wallet?.createdAt
                ? new Date(wallet.createdAt * 1000).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>
      </Card>

      {/* Counterparty Profile */}
      {counterparty && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Counterparty Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Display Name</p>
              <p className="mt-1 font-medium">{counterparty.displayName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="mt-1">
                <span className="px-3 py-1 rounded bg-muted text-sm">
                  {counterparty.type}
                </span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Sent Transactions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Sent Transactions</h2>
        <div className="space-y-3">
          {sentPayNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sent transactions
            </p>
          ) : (
            sentPayNotes.map((note) => (
              <div
                key={note.payNoteId}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">{note.payReference}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(note.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    -{note.amountWei} wei
                  </p>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Received Transactions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Received Transactions</h2>
        <div className="space-y-3">
          {receivedPayNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No received transactions
            </p>
          ) : (
            receivedPayNotes.map((note) => (
              <div
                key={note.payNoteId}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">{note.payReference}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(note.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +{note.amountWei} wei
                  </p>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
