import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from './ui/modal'
import { Badge } from './ui/badge'
import { Clock, AlertCircle, CheckCircle, TrendingUp, FileText, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Notification {
  id: string
  type: 'case_update' | 'payment_received' | 'action_required' | 'status_change' | 'reminder'
  title: string
  message: string
  timestamp: string
  read: boolean
  link?: string
  caseId?: string
  priority?: 'high' | 'medium' | 'low'
}

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onNotificationClick: (notification: Notification) => void
  onMarkAsRead: (notificationId: string) => void
}

export function NotificationModal({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onMarkAsRead
}: NotificationModalProps) {
  const navigate = useNavigate()

  const handleNotificationClick = (notification: Notification) => {
    onMarkAsRead(notification.id)
    
    if (notification.link) {
      navigate(notification.link)
      onClose()
    } else if (notification.caseId) {
      navigate(`/case/${notification.caseId}`)
      onClose()
    }
    
    onNotificationClick(notification)
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'case_update':
        return <FileText className="h-5 w-5 text-blue-500" />
      case 'payment_received':
        return <DollarSign className="h-5 w-5 text-green-500" />
      case 'action_required':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'status_change':
        return <TrendingUp className="h-5 w-5 text-purple-500" />
      case 'reminder':
        return <Clock className="h-5 w-5 text-orange-500" />
    }
  }

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null
    
    const variants = {
      high: 'destructive' as const,
      medium: 'warning' as const,
      low: 'secondary' as const
    }
    
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Notifications" 
      size="md"
    >
      <div className="space-y-2">
        {/* Header Info */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
          <p className="text-sm text-slate-500">
            {unreadCount > 0 ? (
              <span className="font-medium text-slate-900">{unreadCount} unread</span>
            ) : (
              'All caught up!'
            )}
          </p>
          {notifications.length > 0 && (
            <button 
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => notifications.forEach(n => onMarkAsRead(n.id))}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No notifications</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "w-full text-left p-4 rounded-lg transition-colors hover:bg-slate-50",
                  !notification.read && "bg-blue-50/50"
                )}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={cn(
                        "text-sm font-medium text-slate-900",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </h4>
                      {notification.priority && getPriorityBadge(notification.priority)}
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      {!notification.read && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
