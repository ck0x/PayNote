"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";

type ReferenceEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: PayNoteExpanded | null;
  onSubmit: (nextReference: string | null) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function ReferenceEditorDialog({
  open,
  onOpenChange,
  note,
  onSubmit,
  isSubmitting = false,
}: ReferenceEditorDialogProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(note?.payReference ?? "");
  }, [note]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    await onSubmit(trimmed.length ? trimmed : null);
  };

  const handleClear = async () => {
    await onSubmit(null);
  };

  const label = note?.payReference ? "Edit reference" : "Add reference";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              References help your team understand why this payment was sent.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Payment reference
            </label>
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="e.g. February payroll"
              disabled={isSubmitting}
              maxLength={120}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Maximum 120 characters. Leave empty to remove the reference.
            </p>
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
