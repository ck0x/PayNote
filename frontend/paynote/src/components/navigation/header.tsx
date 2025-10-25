"use client";

import { AccountInfo } from "@/components/auth/account-info";
import SidebarToggle from "@/components/navigation/sidebar-toggle";
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const { account, isLoading } = useAuth();
  const showAccountInfo = Boolean(account) && !isLoading;

  return (
    <section className="overflow-hidden bg-brand-gradient text-primary-foreground shadow-card">
      <div className="flex flex-col gap-2 px-6 pt-6 sm:px-8 sm:pt-8 sm:pb-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <SidebarToggle />
          </div>
          <div className="flex items-center gap-3">
            {showAccountInfo ? <AccountInfo /> : <WalletConnectButton />}
          </div>
        </div>
      </div>
    </section>
  );
}
