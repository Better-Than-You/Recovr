import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  Briefcase,
  Clock,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  UserPlus,
  Building2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useState } from 'react'
import { useAuthStore } from '@/stores'

type Role = 'fedex' | 'agency'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: Role[]
}

const navItems: NavItem[] = [
  {
    title: 'Global Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['fedex']
  },
  {
    title: 'Case Allocation',
    href: '/case-allocation',
    icon: Users,
    roles: ['fedex']
  },
  {
    title: 'Add Customer',
    href: '/add-user',
    icon: UserPlus,
    roles: ['fedex']
  },
  {
    title: 'Agencies',
    href: '/agencies',
    icon: Briefcase,
    roles: ['fedex']
  },
  {
    title: 'Add DCA',
    href: '/add-dca',
    icon: Building2,
    roles: ['fedex']
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    roles: ['fedex', 'agency']
  },
  {
    title: 'Agency Performance',
    href: '/agency-performance',
    icon: TrendingUp,
    roles: ['fedex']
  },
  {
    title: 'Audit Logs',
    href: '/audit-logs',
    icon: FileText,
    roles: ['fedex']
  },
  {
    title: 'My Assigned Cases',
    href: '/my-cases',
    icon: Briefcase,
    roles: ['agency']
  },
  {
    title: 'Pending Actions',
    href: '/pending-actions',
    icon: Clock,
    roles: ['agency']
  },
  {
    title: 'Recovery Stats',
    href: '/recovery-stats',
    icon: BarChart3,
    roles: ['agency']
  }
]

interface SidebarProps {
  currentRole: Role
}

export function Sidebar({ currentRole }: SidebarProps) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const user = useAuthStore(state => state.user)
  
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(currentRole)
  )

  return (
    <div className={cn(
      "flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="border-b border-slate-200 h-20 px-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-slate-900 truncate">Recovr</h1>
            {/* <p className="text-xs text-slate-500 mt-0.5">kuch to text</p> */}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 shrink-0"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1 overflow-hidden">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative group",
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && user && (
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 shrink-0">
              <span className="text-sm font-medium text-slate-700">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}