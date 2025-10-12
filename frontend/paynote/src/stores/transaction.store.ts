import { makeAutoObservable, flow } from "mobx";

export type TxCategory = "Personal" | "R&D" | "Customer" | "Ops" | "Unknown";

export class TransactionStore {
  loading = false;
  error: string | null = null;
  // TODO - ENVIO REPLACE – you’ll replace with Envio-typed results later
  items: Array<{
    hash: string;
    from: string;
    to: string;
    value: string;
    ts: string;
    category?: TxCategory;
  }> = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCategory(hash: string, category: TxCategory) {
    const tx = this.items.find((t) => t.hash === hash);
    if (tx) tx.category = category;
  }

  fetchLatest = flow(function* (this: TransactionStore, address: string) {
    this.loading = true;
    this.error = null;
    try {
      // TODO - ENVIO REPLACE placeholder until Envio client wired
      this.items = [];
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : "Failed";
    } finally {
      this.loading = false;
    }
  });
}
