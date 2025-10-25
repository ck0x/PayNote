"use client";
import { observer } from "mobx-react-lite";
// import { useStore } from "../../src/app/providers";
// import { useTransactions } from "../../src/envio/useTransactions";
import { Card } from "../../../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "../../../components/visualisations/table";

const Address = process.env.NEXT_PUBLIC_DEFAULT_ADDRESS ?? "";

function TransactionsTable() {
  const { data, isLoading, error } = useTransactions(Address, 100);
  if (isLoading) return <div className="p-4">Loading…</div>;
  if (error) return <div className="p-4 text-red-500">{String(error)}</div>;

  const txs = data?.transactions ?? [];
  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hash</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Value (wei)</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {txs.map((t: any) => (
            <TableRow key={t.hash}>
              <TableCell className="font-mono truncate">{t.hash}</TableCell>
              <TableCell className="font-mono">{t.from}</TableCell>
              <TableCell className="font-mono">{t.to}</TableCell>
              <TableCell className="font-mono">{t.value}</TableCell>
              <TableCell>{new Date(t.ts).toLocaleString()}</TableCell>
              <TableCell>{/* filled by MCP categorizer later */}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export default observer(TransactionsTable);
