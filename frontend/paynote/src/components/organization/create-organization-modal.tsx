"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/api";
import { useOrganization } from "@/context/organization-context";
import type { OrganizationCreate } from "@/api/types/requests";

// Inline Label component to avoid import issues
const Label = ({
  children,
  htmlFor,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { htmlFor?: string }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    {...props}
  >
    {children}
  </label>
);

interface CreateOrganizationModalProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateOrganizationModal({
  onSuccess,
  trigger,
}: CreateOrganizationModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { switchOrganization } = useOrganization();

  const [formData, setFormData] = useState<OrganizationCreate>({
    name: "",
    slug: "",
    primaryCurrency: "USD",
  });

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      // Auto-generate slug from name
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Organization name is required");
      return;
    }

    if (!formData.slug.trim()) {
      setError("Organization slug is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create organization
      const newOrg = await api.organizations.create(formData);

      // Automatically switch to the new organization
      await switchOrganization(newOrg.orgId);

      // Trigger success callback to refresh organizations list
      if (onSuccess) {
        await onSuccess();
      }

      // Reset form
      setFormData({
        name: "",
        slug: "",
        primaryCurrency: "USD",
      });

      // Close modal
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create organization. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="w-full">
      <Plus className="mr-2 size-4" />
      Create Organization
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to manage your team and resources.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Acme Inc."
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="acme-inc"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs: paynote.app/org/{formData.slug || "your-org"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Primary Currency</Label>
              <select
                id="currency"
                value={formData.primaryCurrency}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    primaryCurrency: e.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Organization"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
