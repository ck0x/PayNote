'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebar } from './sidebar-provider'

export default function SidebarToggle() {
  const {
    showSidebarState: [, setIsShowSidebar],
  } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden text-feather-600 hover:text-feather-500 hover:bg-ice-100 transition-all duration-base"
      onClick={() => setIsShowSidebar(true)}
      aria-label="Open sidebar"
    >
      <Menu className="size-5" />
    </Button>
  )
}
