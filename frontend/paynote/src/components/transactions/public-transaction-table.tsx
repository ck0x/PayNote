import { Button } from "@/components/ui/button";

interface PublicTransactionRow {
  hash: string;
  from: string;
  to: string;
  status: "Settled" | "Pending" | "Failed";
  usd: string;
  eth: string;
  network: string;
  ts: string;
  category: string;
}

interface PublicTransactionTableProps {
  items: PublicTransactionRow[];
  onSignIn: () => void;
}

export function PublicTransactionTable({
  items,
  onSignIn,
}: PublicTransactionTableProps) {
  return (
    <section className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-card">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Public Transactions
          </p>
          <p className="text-xs text-muted-foreground">
            Recent on-chain activity
          </p>
        </div>
        <Button onClick={onSignIn} variant="default" size="sm">
          Sign in for full dashboard
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-left text-xs font-medium text-muted-foreground">
              <th className="pb-3 pr-4">Hash</th>
              <th className="pb-3 pr-4">From</th>
              <th className="pb-3 pr-4">To</th>
              <th className="pb-3 pr-4">Value</th>
              <th className="pb-3 pr-4">Network</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Category</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.hash} className="border-b border-border/30 text-sm">
                <td className="py-3 pr-4 font-mono text-xs">{row.hash}</td>
                <td className="py-3 pr-4 font-mono text-xs">{row.from}</td>
                <td className="py-3 pr-4 font-mono text-xs">{row.to}</td>
                <td className="py-3 pr-4">
                  <div className="font-semibold text-foreground">
                    {row.usd}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {row.eth}
                  </div>
                </td>
                <td className="py-3 pr-4">{row.network}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      row.status === "Settled"
                        ? "bg-success/10 text-success"
                        : row.status === "Pending"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-3">{row.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
