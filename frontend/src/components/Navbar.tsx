import { useState, Fragment } from 'react'
import { Bell, Search, Settings, HelpCircle, User } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { NotificationModal } from './NotificationModal'
import { mockNotifications, type Notification } from '@/data/mockData'

type Role = 'fedex' | 'dca'

interface NavbarProps {
  currentRole: Role
}

export function Navbar({ currentRole }: NavbarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const handleNotificationClick = (notification: Notification) => {
    // Additional logic can be added here if needed
    console.log('Notification clicked:', notification)
  }

  return (
    <>
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="flex h-20 items-center justify-between px-8 gap-6">
        {/* Left - Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search cases, customers, or accounts..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Right - Icons, Role Badge & User Profile */}
        <div className="flex items-center gap-2">
          {/* Help */}
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 relative"
            onClick={() => setIsNotificationOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {unreadCount}
                </span>
              </>
            )}
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* Role Badge */}
          <Badge 
            variant={currentRole === 'fedex' ? 'default' : 'secondary'}
            className="hidden sm:flex px-4 py-1.5 text-sm"
          >
            {currentRole === 'fedex' ? 'FedEx Admin' : 'DCA Agent'}
          </Badge>

          {/* User Profile */}
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
              <User className="h-4 w-4 text-slate-700" />
            </div>
          </Button>
        </div>
      </div>
    </header>

    {/* Notification Modal */}
    <NotificationModal
      isOpen={isNotificationOpen}
      onClose={() => setIsNotificationOpen(false)}
      notifications={notifications}
      onNotificationClick={handleNotificationClick}
      onMarkAsRead={handleMarkAsRead}
    />
    </>
  )
}
