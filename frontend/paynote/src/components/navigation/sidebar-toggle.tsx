"use client";

import { Menu, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-provider";

export default function SidebarToggle() {
  const {
    showSidebarState: [isShowSidebar, setIsShowSidebar],
  } = useSidebar();

  return (
    <Button
      variant="default"
      size="icon"
      className="lg:hidden"
      onClick={() => setIsShowSidebar(!isShowSidebar)}
      aria-label={isShowSidebar ? "Close sidebar" : "Open sidebar"}
    >
      {isShowSidebar ? (
        <PanelLeftClose className="size-5" />
      ) : (
        <Menu className="size-5" />
      )}
    </Button>
  );
}
