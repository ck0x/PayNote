"use client";

import Link from "next/link";
import { ChevronsUpDown, LogOut, Settings, Shield } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const FALLBACK_INITIALS = "PN";

function getInitials(source?: string | null) {
  if (!source) {
    return FALLBACK_INITIALS;
  }

  const cleaned = source.trim();
  if (!cleaned) {
    return FALLBACK_INITIALS;
  }

  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRole(role?: string | null) {
  if (!role) {
    return "Member";
  }
  return role;
}

export function AccountInfo() {
  const { account, logout, isLoading } = useAuth();
  const { toast } = useToast();

  if (!account || isLoading) {
    return null;
  }

  const initials = getInitials(account.displayName || account.email || "User");

  const accountDetails = [
    { label: "Account ID", value: account.accountId },
    { label: "Organization ID", value: account.orgId },
    { label: "Email", value: account.email || "Not provided" },
    { label: "Role", value: formatRole(account.role) },
    {
      label: "Default Wallet",
      value: account.defaultWalletId ?? "Not assigned",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You have been logged out.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to log out. Try again.";
      toast({
        title: "Logout failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleLogoutSelect = (event: Event) => {
    event.preventDefault();
    void handleLogout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/70 px-3 py-2 text-left shadow-card transition hover:border-border hover:bg-background"
          aria-label="Open account menu"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {initials}
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold leading-tight text-foreground">
              {account.displayName || "Unnamed account"}
            </span>
            <span className="text-xs text-muted-foreground">
              {account.email || "Wallet-only account"}
            </span>
          </span>
          <ChevronsUpDown className="ml-1 size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-80 space-y-2 rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm"
      >
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          Account
        </DropdownMenuLabel>
        <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
          <p className="text-sm font-semibold text-foreground">
            {account.displayName || "Unnamed account"}
          </p>
          <p className="text-xs text-muted-foreground">
            {account.email || "Wallet-only account"}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2 py-0.5 text-xs font-medium text-foreground">
            <Shield className="size-3.5 text-muted-foreground" />
            {formatRole(account.role)}
          </span>
        </div>
        <div className="space-y-2 rounded-lg border border-dashed border-border/60 bg-background/40 p-3">
          {accountDetails.map((detail) => (
            <div
              key={detail.label}
              className="flex flex-col gap-0.5 text-xs text-muted-foreground"
            >
              <span>{detail.label}</span>
              <span
                className={cn(
                  "font-mono text-[11px] text-foreground",
                  detail.value === "Not assigned" && "text-muted-foreground"
                )}
                title={detail.value}
              >
                {detail.value || "-"}
              </span>
            </div>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="size-4 text-muted-foreground" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleLogoutSelect} variant="destructive">
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <div className="rounded-lg border border-border/40 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
          <p>
            Need to update your wallets? Visit account settings to manage keys
            and defaults.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
