'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-provider'

export default function SidebarOverlay() {
  const {
    showSidebarState: [isShowSidebar, setIsShowSidebar],
  } = useSidebar()

  const hideSidebar = () => {
    setIsShowSidebar(false)
  }

  return (
    <div
      tabIndex={-1}
      aria-hidden
      className={cn(
        'fixed top-0 left-0 w-full h-full bg-black/50 transition-opacity z-40',
        isShowSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={hideSidebar}
    />
  )
}
