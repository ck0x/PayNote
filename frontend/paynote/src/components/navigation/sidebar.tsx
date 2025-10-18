"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarNavGroup from "./sidebar-nav-group";
import SidebarOverlay from "./sidebar-overlay";
import { Button } from "@/components/ui/button";
import {
  Home,
  CreditCard,
  Settings,
  Wallet,
  FileText,
  BarChart3,
  Users,
  X,
} from "lucide-react";

export default function Sidebar({ children }: { children: ReactNode }) {
  const {
    showSidebarState: [isShowSidebar, setIsShowSidebar],
  } = useSidebar();

  return (
    <>
      <SidebarOverlay />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r border-silver-200 bg-paper-0 dark:bg-background shadow-sm transition-transform duration-base lg:static lg:block",
            isShowSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo/Brand */}
            <div className="flex h-16 items-center justify-between border-b border-silver-200 px-4 bg-gradient-to-r from-feather-600/5 to-transparent">
              <Link href="/" className="text-xl font-bold bg-quill-sweep bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                PayNote
              </Link>
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden text-feather-600 hover:text-feather-500 hover:bg-ice-100"
                onClick={() => setIsShowSidebar(false)}
                aria-label="Close sidebar"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              <SidebarNavItem href="/" icon={Home}>
                Dashboard
              </SidebarNavItem>

              <SidebarNavItem href="/transactions" icon={CreditCard}>
                Transactions
              </SidebarNavItem>

              <SidebarNavGroup toggleIcon={Wallet} toggleText="Payments">
                <SidebarNavItem href="/payments/history" icon={FileText}>
                  Payment History
                </SidebarNavItem>
                <SidebarNavItem href="/payments/recurring" icon={BarChart3}>
                  Recurring Payments
                </SidebarNavItem>
              </SidebarNavGroup>

              <SidebarNavGroup toggleIcon={Users} toggleText="Team">
                <SidebarNavItem href="/team/members">
                  Members
                </SidebarNavItem>
                <SidebarNavItem href="/team/roles">
                  Roles
                </SidebarNavItem>
              </SidebarNavGroup>
            </nav>

            {/* Bottom section */}
            <div className="border-t border-silver-200 p-4 bg-ice-100/30">
              <SidebarNavItem href="/settings" icon={Settings}>
                Settings
              </SidebarNavItem>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-col bg-paper-0 dark:bg-background">{children}</main>
      </div>
    </>
  );
}
