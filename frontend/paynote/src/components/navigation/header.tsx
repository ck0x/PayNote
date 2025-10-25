"use client";

import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import SidebarToggle from "@/components/navigation/sidebar-toggle";

export function Header() {
  return (
    <section className="overflow-hidden bg-brand-gradient text-primary-foreground shadow-card">
      <div className="flex flex-col gap-2 px-6 pt-6 sm:px-8 sm:pt-8 sm:pb-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <SidebarToggle />
          </div>
          <div className="flex items-center gap-3">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </section>
  );
}
