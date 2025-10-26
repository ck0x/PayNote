"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/provider";
import { Category } from "@/stores/types/Category";

interface CategoryFilterProps {
  value?: Category;
  onChange?: (value: Category) => void;
}

export const CategoryFilter = observer(function CategoryFilter({
  value: propValue,
  onChange: propOnChange,
}: CategoryFilterProps = {}) {
  const { transactions } = useStore();

  const value = propValue ?? transactions.categoryFilter;
  const onChange =
    propOnChange ?? ((v: Category) => transactions.setCategory(v));

  const handleChange = (val: string) => {
    if (val === "All") {
      onChange(Category.All);
    } else {
      onChange(val as Category);
    }
  };

  return (
    <select
      className="inline-flex h-10 items-center rounded-2xl border border-border/80 bg-secondary/80 px-4 text-sm font-semibold text-secondary-foreground shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    >
      {Object.values(Category).map((o) => (
        <option key={o} className="bg-card text-foreground">
          {o}
        </option>
      ))}
    </select>
  );
});
