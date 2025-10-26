"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categoriesApi } from "@/api";
import { useOrganization } from "@/context/organization-context";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";
import type { Category } from "@/types/interfaces/Category";

type ReferenceEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: PayNoteExpanded | null;
  onSubmit: (data: {
    payReference: string | null;
    category?: Category;
  }) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function ReferenceEditorDialog({
  open,
  onOpenChange,
  note,
  onSubmit,
  isSubmitting = false,
}: ReferenceEditorDialogProps) {
  const { currentOrg } = useOrganization();
  const [reference, setReference] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Fetch categories when dialog opens
  useEffect(() => {
    if (!open || !currentOrg) return;

    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const result = await categoriesApi.list(currentOrg.orgId);
        setCategories(result);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [open, currentOrg]);

  useEffect(() => {
    setReference(note?.payReference ?? "");
    const currentCategoryId = note?.categories?.[0]?.categoryId ?? "";
    setSelectedCategoryId(currentCategoryId);
  }, [note]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = reference.trim();

    // Find the selected category object
    const selectedCategory = categories.find(
      (cat) => cat.categoryId === selectedCategoryId
    );

    await onSubmit({
      payReference: trimmed.length ? trimmed : null,
      category: selectedCategory,
    });
  };

  const handleClear = async () => {
    // Find the selected category object
    const selectedCategory = categories.find(
      (cat) => cat.categoryId === selectedCategoryId
    );

    await onSubmit({
      payReference: null,
      category: selectedCategory,
    });
  };

  const label = note?.payReference ? "Edit reference" : "Add reference";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              Add a reference and category to help your team understand this
              payment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Payment reference
              </label>
              <Input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="e.g. February payroll"
                disabled={isSubmitting}
                maxLength={120}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Maximum 120 characters. Leave empty to remove the reference.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedCategoryId}
                onChange={(event) => setSelectedCategoryId(event.target.value)}
                disabled={isSubmitting || isLoadingCategories}
              >
                <option value="">
                  {isLoadingCategories ? "Loading..." : "-- No category --"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Categorize this transaction for better organization.
              </p>
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              {note?.payReference ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClear}
                  disabled={isSubmitting}
                >
                  Remove reference
                </Button>
              ) : (
                <span />
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {note?.payReference ? "Save changes" : "Add reference"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
