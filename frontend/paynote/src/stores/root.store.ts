import { TransactionStore } from "./transaction.store";

export class RootStore {
  transactions = new TransactionStore();
}

export const rootStore = new RootStore();
