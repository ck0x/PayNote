"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PayNote } from "@/types/interfaces/PayNote";
import type { Network } from "@/types/interfaces/Network";
import type { Attachment } from "@/types/interfaces/Attachment";
import type { Category } from "@/types/interfaces/Category";
export default function TransactionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Fetch PayNote by ID
  const payNote: PayNote | undefined = undefined;
  const network: Network | undefined = undefined;
  const categories: Category[] = [];
  const attachments: Attachment[] = [];

  if (!payNote) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Transaction not found</p>
          <p className="text-sm text-muted-foreground mt-2">ID: {params.id}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction Details</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            {params.id}
          </p>
        </div>
        <Button variant="outline">View on Explorer</Button>
      </div>

      {/* Main Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Reference</h2>
        <p className="text-lg mb-6">
          {payNote.payReference || "No reference provided"}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Transaction Hash</p>
            <p className="font-mono text-sm mt-1">{payNote.txHash}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="mt-1">
              <span
                className={`px-3 py-1 rounded text-sm ${
                  payNote.status === "Settled"
                    ? "bg-green-100 text-green-800"
                    : payNote.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {payNote.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-semibold mt-1">{payNote.amountWei} wei</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Network</p>
            <p className="mt-1">
              {network?.name ?? `Chain ${payNote.chainId}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Timestamp</p>
            <p className="mt-1">
              {new Date(payNote.timestamp * 1000).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Categories */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories assigned
            </p>
          ) : (
            categories.map((cat) => (
              <span
                key={cat.categoryId}
                className="px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: cat.color + "33", color: cat.color }}
              >
                {cat.icon} {cat.name}
              </span>
            ))
          )}
        </div>
      </Card>

      {/* Attachments */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Attachments</h2>
        <div className="space-y-2">
          {attachments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attachments</p>
          ) : (
            attachments.map((att) => (
              <div
                key={att.fileId}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div>
                  <p className="font-medium">{att.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {att.mimeType} • {(att.sizeBytes / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
