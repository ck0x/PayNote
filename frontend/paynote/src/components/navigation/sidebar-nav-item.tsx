"use client";

import React, { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/navigation/sidebar-provider";

type Props = {
  href: string;
  icon?: LucideIcon;
} & PropsWithChildren;

export default function SidebarNavItem(props: Props) {
  const { icon: Icon, children, href } = props;

  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  const {
    showSidebarState: [, setIsShowSidebar],
  } = useSidebar();

  return (
    <Link
      href={href}
      onClick={() => setIsShowSidebar(false)}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {Icon ? (
        <Icon className="size-4 shrink-0" />
      ) : (
        <span className="size-4 shrink-0" />
      )}
      <span>{children}</span>
    </Link>
  );
}
