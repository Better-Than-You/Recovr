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
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useState } from 'react'

type Role = 'fedex' | 'dca'

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
    title: 'Agencies',
    href: '/agencies',
    icon: Briefcase,
    roles: ['fedex']
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    roles: ['fedex', 'dca']
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
    roles: ['dca']
  },
  {
    title: 'Pending Actions',
    href: '/pending-actions',
    icon: Clock,
    roles: ['dca']
  },
  {
    title: 'Recovery Stats',
    href: '/recovery-stats',
    icon: BarChart3,
    roles: ['dca']
  }
]

interface SidebarProps {
  currentRole: Role
  onRoleChange: (role: Role) => void
}

export function Sidebar({ currentRole, onRoleChange }: SidebarProps) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(currentRole)
  )

  return (
    <div className={cn(
      "flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="border-b border-slate-200 p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">DCA Platform</h1>
            <p className="text-xs text-slate-500 mt-0.5">FedEx Case Study</p>
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

      {/* Role Switcher */}
      {!collapsed && (
        <div className="border-b border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 mb-2">VIEW AS</p>
          <div className="flex gap-2">
            <Button
              variant={currentRole === 'fedex' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleChange('fedex')}
              className="flex-1"
            >
              FedEx Admin
            </Button>
            <Button
              variant={currentRole === 'dca' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleChange('dca')}
              className="flex-1"
            >
              DCA Agent
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
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
      {!collapsed && (
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 shrink-0">
              <span className="text-sm font-medium text-slate-700">
                {currentRole === 'fedex' ? 'FA' : 'DA'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {currentRole === 'fedex' ? 'FedEx Admin' : 'DCA Agent'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {currentRole === 'fedex' ? 'admin@fedex.com' : 'agent@dca.com'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
