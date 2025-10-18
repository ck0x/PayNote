'use client'

import React, { PropsWithChildren } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/navigation/sidebar-provider'

type Props = {
  href: string
  icon?: LucideIcon
} & PropsWithChildren

export default function SidebarNavItem(props: Props) {
  const {
    icon: Icon,
    children,
    href,
  } = props

  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(`${href}/`)

  const {
    showSidebarState: [, setIsShowSidebar],
  } = useSidebar()

  return (
    <Link
      href={href}
      onClick={() => setIsShowSidebar(false)}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-base',
        'hover:bg-ice-100 hover:text-feather-600 hover:scale-[1.02]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feather-500 focus-visible:ring-offset-2',
        isActive 
          ? 'bg-gradient-to-r from-feather-600 to-feather-500 text-white shadow-sm hover:shadow-md hover:from-feather-500 hover:to-feather-600 hover:scale-100' 
          : 'text-ink-900 dark:text-foreground'
      )}
    >
      {Icon ? (
        <Icon className={cn("size-4 shrink-0", isActive && "drop-shadow-sm")} />
      ) : (
        <span className="size-4 shrink-0" />
      )}
      <span>{children}</span>
    </Link>
  )
}
