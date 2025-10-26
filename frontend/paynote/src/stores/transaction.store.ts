import { makeAutoObservable, flow } from "mobx";
import { Category } from "./types/Category";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";
import type { Category as CategoryDetail } from "@/types/interfaces/Category";
import { examplePayNotes } from "@/tests/example-data/transactions";

export class TransactionStore {
  loading = false;
  error: string | null = null;
  categoryFilter: Category = Category.All;
  search = "";
  items: PayNoteExpanded[] = examplePayNotes;

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
    const tx = this.items.find((t) => t.txHash === hash);
    if (!tx) return;

    const nextCategory: CategoryDetail = {
      categoryId: tx.categories?.[0]?.categoryId ?? `local-${category}`,
      orgId: tx.orgId ?? "demo-org",
      name: category,
      color: tx.categories?.[0]?.color ?? "#A5B4FC",
      icon: tx.categories?.[0]?.icon ?? "tag",
      visibility: tx.categories?.[0]?.visibility ?? "Private",
    };

    tx.categories = [nextCategory];
  }

  get filteredItems() {
    const normalizedSearch = this.search.trim().toLowerCase();

    return this.items.filter((item) => {
      const matchesCategory =
        this.categoryFilter === Category.All ||
        item.categories?.some((cat) => cat.name === this.categoryFilter);

      const matchesSearch =
        !normalizedSearch ||
        item.txHash.toLowerCase().includes(normalizedSearch) ||
        item.senderWalletId.toLowerCase().includes(normalizedSearch) ||
        item.recipientWalletId.toLowerCase().includes(normalizedSearch) ||
        (item.payReference ?? "").toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }

  fetchLatest = flow(function* (this: TransactionStore, _address: string) {
    this.loading = true;
    this.error = null;
    try {
      // TODO - ENVIO REPLACE placeholder until Envio client wired
      this.items = examplePayNotes;
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
