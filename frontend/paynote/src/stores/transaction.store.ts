import { makeAutoObservable, flow } from "mobx";
import { Category } from "./types/Category";
import { exampleTransactions } from "@/tests/example-data/transactions";

export type TransactionItem = {
  hash: string;
  from: string;
  to: string;
  valueEth: string;
  valueUsd: string;
  ts: string;
  status: "confirmed" | "pending";
  network: string;
  category: Category;
  note: string;
};

export class TransactionStore {
  loading = false;
  error: string | null = null;
  categoryFilter: Category = Category.All;
  search = "";
  items: TransactionItem[] = exampleTransactions;

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

  get filteredItems() {
    const normalizedSearch = this.search.trim().toLowerCase();

    return this.items.filter((item) => {
      const matchesCategory =
        this.categoryFilter === Category.All ||
        item.category === this.categoryFilter;

      const matchesSearch =
        !normalizedSearch ||
        item.hash.toLowerCase().includes(normalizedSearch) ||
        item.from.toLowerCase().includes(normalizedSearch) ||
        item.to.toLowerCase().includes(normalizedSearch) ||
        item.note.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }

  fetchLatest = flow(function* (this: TransactionStore, _address: string) {
    this.loading = true;
    this.error = null;
    try {
      // TODO - ENVIO REPLACE placeholder until Envio client wired
      this.items = exampleTransactions;
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
