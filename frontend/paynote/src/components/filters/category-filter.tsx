"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/provider";
import { Category } from "@/stores/types/Category";

export const CategoryFilter = observer(function CategoryFilter() {
  const { transactions } = useStore();

  const handleChange = (value: string) => {
    if (value === "All") {
      transactions.setCategory(Category.All);
    } else {
      transactions.setCategory(value as Category);
    }
  };

  return (
    <label className="inline-flex flex-col gap-1 text-xs font-medium text-muted-foreground">
      Category
      <select
        className="inline-flex h-10 items-center rounded-2xl border border-border/80 bg-secondary/80 px-4 text-sm font-semibold text-secondary-foreground shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={transactions.categoryFilter}
        onChange={(e) => handleChange(e.target.value)}
      >
        {Object.values(Category).map((o) => (
          <option key={o} className="bg-card text-foreground">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
});
