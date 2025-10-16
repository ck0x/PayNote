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
      className="lg:hidden"
      onClick={() => setIsShowSidebar(true)}
      aria-label="Open sidebar"
    >
      <Menu className="size-5" />
    </Button>
  )
}
