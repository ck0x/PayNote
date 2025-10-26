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
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-pigment-green text-white/98 border border-xanthous",
        "hover:bg-pigment-green/10 hover:border-xanthous/40 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xanthous focus-visible:ring-offset-2",
        isActive &&
          "bg-pigment-green/15 border-xanthous text-foreground font-semibold shadow-sm"
      )}
    >
      {Icon ? (
        <Icon
          className={cn("size-4 shrink-0", isActive && "text-pigment-green")}
        />
      ) : (
        <span className="size-4 shrink-0" />
      )}
      <span>{children}</span>
    </Link>
  );
}
