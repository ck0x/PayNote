// Example usage of sidebar components with shadcn

import SidebarNavItem from '@/components/navigation/sidebar-nav-item'
import SidebarNavGroup from '@/components/navigation/sidebar-nav-group'
import { 
  Home, 
  Settings, 
  CreditCard, 
  BarChart3,
  FileText,
  Users,
  Wallet
} from 'lucide-react'

export function SidebarExample() {
  return (
    <nav className="space-y-1">
      {/* Simple nav items */}
      <SidebarNavItem href="/dashboard" icon={Home}>
        Dashboard
      </SidebarNavItem>

      <SidebarNavItem href="/transactions" icon={CreditCard}>
        Transactions
      </SidebarNavItem>

      {/* Grouped nav items with collapsible sections */}
      <SidebarNavGroup toggleIcon={Wallet} toggleText="Payments">
        <SidebarNavItem href="/payments/history" icon={FileText}>
          Payment History
        </SidebarNavItem>
        <SidebarNavItem href="/payments/recurring" icon={BarChart3}>
          Recurring Payments
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={Users} toggleText="Team">
        <SidebarNavItem href="/team/members">
          Members
        </SidebarNavItem>
        <SidebarNavItem href="/team/roles">
          Roles
        </SidebarNavItem>
      </SidebarNavGroup>

      {/* Settings at bottom */}
      <SidebarNavItem href="/settings" icon={Settings}>
        Settings
      </SidebarNavItem>
    </nav>
  )
}
