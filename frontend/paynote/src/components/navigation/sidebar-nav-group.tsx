"use client";

import React, { PropsWithChildren } from "react";
import { LucideIcon, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SidebarNavGroupProps = {
  toggleIcon: LucideIcon;
  toggleText: string;
} & PropsWithChildren;

export default function SidebarNavGroup(props: SidebarNavGroupProps) {
  const { toggleIcon: Icon, toggleText, children } = props;

  return (
    <Accordion type="single" collapsible className="border-0">
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-transparent",
            "hover:bg-pigment-green/10 hover:border-xanthous/40 hover:text-foreground hover:no-underline",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xanthous focus-visible:ring-offset-2",
            "[&[data-state=open]>svg:last-child]:rotate-180",
            "[&[data-state=open]]:bg-pigment-green/15 [&[data-state=open]]:border-xanthous/60"
          )}
        >
          <Icon className="size-4 shrink-0 text-pigment-green" />
          <span className="flex-1 text-left">{toggleText}</span>
          <ChevronUp className="size-4 shrink-0 text-xanthous transition-transform duration-200" />
        </AccordionTrigger>
        <AccordionContent className="pb-1 pt-1">
          <ul className="space-y-1 pl-7">{children}</ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
