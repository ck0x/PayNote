import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PayNote } from "@/types/interfaces/PayNote";

interface RecentPayNotesCardProps {
  payNotes: PayNote[];
  className?: string;
}

export function RecentPayNotesCard({
  payNotes,
  className,
}: RecentPayNotesCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {payNotes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No recent transactions
          </p>
        ) : (
          payNotes.map((note) => (
            <div
              key={note.payNoteId}
              className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{note.payReference}</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {note.txHash.slice(0, 16)}...
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{note.amountWei} wei</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    note.status === "Settled"
                      ? "bg-green-100 text-green-800"
                      : note.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {note.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
