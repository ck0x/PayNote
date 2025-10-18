'use client'

import React, { PropsWithChildren } from 'react'
import { LucideIcon, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type SidebarNavGroupProps = {
  toggleIcon: LucideIcon
  toggleText: string
} & PropsWithChildren

export default function SidebarNavGroup(props: SidebarNavGroupProps) {
  const {
    toggleIcon: Icon,
    toggleText,
    children,
  } = props

  return (
    <Accordion type="single" collapsible className="border-0">
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-base',
            'hover:bg-ice-100 hover:text-feather-600 hover:no-underline',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feather-500 focus-visible:ring-offset-2',
            'text-ink-900 dark:text-foreground',
            '[&[data-state=open]]:bg-ice-100 [&[data-state=open]]:text-feather-600',
            '[&[data-state=open]>svg:last-child]:rotate-180 [&[data-state=open]>svg:last-child]:text-feather-600'
          )}
        >
          <Icon className="size-4 shrink-0" />
          <span className="flex-1 text-left">{toggleText}</span>
          <ChevronUp className="size-4 shrink-0 transition-all duration-base text-graphite-700" />
        </AccordionTrigger>
        <AccordionContent className="pb-1 pt-1">
          <ul className="space-y-1 pl-7 border-l-2 border-feather-600/20 ml-5">
            {children}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
