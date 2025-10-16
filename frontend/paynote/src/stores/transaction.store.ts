import { makeAutoObservable, flow } from "mobx";
import { Category } from "./types/Category";

// TODO - UPDATE CATEGORIES FROM THESE PLACEHOLDERS
export class TransactionStore {
  loading = false;
  error: string | null = null;
  categoryFilter: Category = Category.All;
  search = "";

  // TODO - ENVIO REPLACE – you'll replace with Envio-typed results later
  items: Array<{
    hash: string;
    from: string;
    to: string;
    value: string;
    ts: string;
    category?: Category;
  }> = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCategory(c: TransactionStore["categoryFilter"]) {
    this.categoryFilter = c;
  }

  setSearch(q: string) {
    this.search = q;
  }

  setItemCategory(hash: string, category: Category) {
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

export class RootStore {
  transactions = new TransactionStore();
}

let _store: RootStore | null = null;
export function getRootStore() {
  if (!_store) _store = new RootStore();
  return _store;
}
