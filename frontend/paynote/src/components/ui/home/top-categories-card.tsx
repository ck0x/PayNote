import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/interfaces/Category";

interface TopCategoriesCardProps {
  categories: Category[];
  className?: string;
}

export function TopCategoriesCard({
  categories,
  className,
}: TopCategoriesCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-muted-foreground text-sm">No categories yet</p>
        ) : (
          categories.map((category) => (
            <div
              key={category.categoryId}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {category.icon}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
