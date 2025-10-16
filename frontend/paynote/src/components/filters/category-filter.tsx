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
    <select
      className="border rounded-md px-2 py-1"
      value={transactions.categoryFilter}
      onChange={(e) => handleChange(e.target.value)}
    >
      {Object.values(Category).map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
});
