"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";
import SidebarNavItem from "./sidebar-nav-item";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Tag,
  Send,
  Braces,
  Settings,
  X,
  Receipt,
  BarChart3,
} from "lucide-react";
import { Header } from "@/components/navigation/header";
import OrganizationSwitcher from "@/components/navigation/organization-switcher";
import { usePrivy } from "@privy-io/react-auth";

export default function Sidebar({ children }: { children: ReactNode }) {
  const {
    showSidebarState: [isShowSidebar, setIsShowSidebar],
  } = useSidebar();

  const { authenticated } = usePrivy();

  // Overview links - conditional based on auth
  const overviewLinks = authenticated
    ? [
        { href: "/", label: "Home", icon: Home },
        { href: "/transactions", label: "Transactions", icon: Receipt },
        { href: "/analytics", label: "Analytics", icon: BarChart3 },
      ]
    : [{ href: "/", label: "Home", icon: Home }];

  // Workspace links - only shown when authenticated
  const workspaceLinks = [
    { href: "/counterparties", label: "Counterparties", icon: Users },
    { href: "/categories", label: "Categories & Rules", icon: Tag },
    { href: "/send", label: "Send Payment", icon: Send },
  ];

  // Resource links - always shown
  const resourceLinks = [
    { href: "/developer", label: "Developer", icon: Braces },
  ];

  return (
    <>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r border-border/60 bg-card/95 shadow-card transition-transform duration-300 backdrop-blur lg:sticky lg:top-0 lg:h-screen",
            isShowSidebar
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex h-screen flex-col">
            <div className="flex-shrink-0 border-b border-border/60 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href="/"
                  className="flex items-center text-xl font-semibold tracking-tight text-foreground"
                >
                  <Image
                    src="/primary-logo-default.svg"
                    alt="PayNote"
                    width={36}
                    height={12}
                    className="mr-2 block"
                  />
                  <span>PayNote</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="lg:hidden"
                  onClick={() => setIsShowSidebar(false)}
                  aria-label="Close sidebar"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <OrganizationSwitcher />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-6 overflow-y-auto p-4 min-h-0">
              <div className="space-y-1">
                {overviewLinks.map((link) => (
                  <SidebarNavItem
                    key={link.href}
                    href={link.href}
                    icon={link.icon}
                  >
                    {link.label}
                  </SidebarNavItem>
                ))}
              </div>

              {authenticated && (
                <div>
                  <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Workspace
                  </p>
                  <div className="mt-2 space-y-1">
                    {workspaceLinks.map((link) => (
                      <SidebarNavItem
                        key={link.href}
                        href={link.href}
                        icon={link.icon}
                      >
                        {link.label}
                      </SidebarNavItem>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Resources
                </p>
                <div className="mt-2 space-y-1">
                  {resourceLinks.map((link) => (
                    <SidebarNavItem
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                    >
                      {link.label}
                    </SidebarNavItem>
                  ))}
                </div>
              </div>
            </nav>

            {/* Bottom section */}
            <div className="flex-shrink-0 border-t p-4">
              <SidebarNavItem href="/settings" icon={Settings}>
                Settings
              </SidebarNavItem>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col">
          <Header />
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </>
  );
}
