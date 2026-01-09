import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Mail, Phone, FileText, Scale, DollarSign, Building2, Repeat,
  User, ArrowRight, Calendar, ChevronDown, ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Event type definitions
export type TimelineEventType = 
  | 'email' 
  | 'call' 
  | 'status_change' 
  | 'payment' 
  | 'legal_notice'
  | 'agency_assignment'
  | 'reassignment'

export interface TimelineCardProps {
  id: string
  eventType: TimelineEventType
  title: string
  timestamp: string
  from?: string
  to?: string
  description?: string
  metadata?: {
    amount?: number
    emailSubject?: string
    emailContent?: string
    previousStatus?: string
    newStatus?: string
    agencyName?: string
    reason?: string
    [key: string]: any
  }
  onReply?: () => void
  onForward?: () => void
}

const eventConfig: Record<TimelineEventType, {
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  borderColor: string
}> = {
  email: {
    icon: Mail,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300'
  },
  call: {
    icon: Phone,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300'
  },
  status_change: {
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300'
  },
  payment: {
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300'
  },
  legal_notice: {
    icon: Scale,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300'
  },
  agency_assignment: {
    icon: Building2,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300'
  },
  reassignment: {
    icon: Repeat,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300'
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export function TimelineCard({
  id: _id,
  eventType,
  title,
  timestamp,
  from,
  to,
  description,
  metadata,
  onReply,
  onForward
}: TimelineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = eventConfig[eventType]
  const Icon = config.icon
  const isEmail = eventType === 'email'
  const isExpandable = isEmail && (metadata?.emailSubject || metadata?.emailContent)

  const handleClick = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className="relative flex gap-4">
      {/* Icon circle */}
      <div className={cn(
        "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 shrink-0",
        config.bgColor,
        config.borderColor
      )}>
        <Icon className={cn("h-5 w-5", config.color)} />
      </div>

      {/* Event content */}
      <div className="flex-1 pb-6">
        <div 
          className={cn(
            "rounded-lg border-2 transition-all bg-white",
            config.borderColor,
            isExpandable && "cursor-pointer hover:shadow-md"
          )}
          onClick={handleClick}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {/* From -> To badges */}
                  {from && to && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        {from}
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <Badge variant="outline" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        {to}
                      </Badge>
                    </div>
                  )}
                  {/* Event type badge */}
                  <Badge variant="secondary" className="text-xs capitalize">
                    {eventType.replace('_', ' ')}
                  </Badge>
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  {title}
                </h4>
              </div>
              <div className="flex items-start gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    {formatDate(timestamp)}
                  </span>
                </div>
                {isExpandable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Email Content */}
            {isEmail && !isExpanded && metadata?.emailSubject && (
              <p className="text-sm text-slate-600 mt-2">
                <span className="font-medium">Subject:</span> {metadata.emailSubject}
              </p>
            )}

            {isEmail && isExpanded && (
              <div className="mt-3 space-y-3">
                {metadata?.emailSubject && (
                  <div className="bg-slate-50 p-3 rounded">
                    <p className="text-xs text-slate-500 font-medium mb-1">Subject</p>
                    <p className="text-sm text-slate-900">{metadata.emailSubject}</p>
                  </div>
                )}
                <div className="bg-slate-50 p-3 rounded">
                  <p className="text-xs text-slate-500 font-medium mb-1">Message</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {metadata?.emailContent || 'No content available.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  {onReply && (
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onReply(); }}>
                      <Mail className="h-3 w-3 mr-2" />
                      Reply
                    </Button>
                  )}
                  {onForward && (
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onForward(); }}>
                      Forward
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Payment Content */}
            {eventType === 'payment' && (
              <div className="mt-3">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-900 font-medium">Payment Received</span>
                    <span className="text-lg font-bold text-emerald-700">
                      {metadata?.amount ? formatCurrency(metadata.amount) : 'N/A'}
                    </span>
                  </div>
                </div>
                {description && (
                  <p className="text-sm text-slate-600 mt-2">{description}</p>
                )}
              </div>
            )}

            {/* Agency Assignment Content */}
            {eventType === 'agency_assignment' && (
              <div className="mt-3 space-y-2">
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-900">
                      {metadata?.agencyName || 'Agency'}
                    </span>
                  </div>
                  {metadata?.reason && (
                    <p className="text-xs text-indigo-700 mt-1">{metadata.reason}</p>
                  )}
                </div>
                {description && (
                  <p className="text-sm text-slate-600">{description}</p>
                )}
              </div>
            )}

            {/* Reassignment Content */}
            {eventType === 'reassignment' && (
              <div className="mt-3 space-y-2">
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2">
                    <Repeat className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">
                      Case Reassigned
                    </span>
                  </div>
                  {metadata?.agencyName && (
                    <p className="text-xs text-orange-700 mt-1">
                      New Agency: {metadata.agencyName}
                    </p>
                  )}
                </div>
                {description && (
                  <p className="text-sm text-slate-600">{description}</p>
                )}
              </div>
            )}

            {/* Status Change Content */}
            {eventType === 'status_change' && (
              <div className="mt-3">
                {metadata?.previousStatus && metadata?.newStatus && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="bg-white">
                        {metadata.previousStatus}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                      <Badge variant="outline" className="bg-white">
                        {metadata.newStatus}
                      </Badge>
                    </div>
                  </div>
                )}
                {description && (
                  <p className="text-sm text-slate-600 mt-2">{description}</p>
                )}
              </div>
            )}

            {/* Legal Notice Content */}
            {eventType === 'legal_notice' && (
              <div className="mt-3">
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-900">Legal Notice Issued</span>
                  </div>
                  {description && (
                    <p className="text-sm text-red-700">{description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Call Content */}
            {eventType === 'call' && description && (
              <p className="text-sm text-slate-600 mt-2">{description}</p>
            )}

            {/* Generic metadata for other types */}
            {!isEmail && 
             eventType !== 'payment' && 
             eventType !== 'agency_assignment' && 
             eventType !== 'reassignment' && 
             eventType !== 'status_change' && 
             eventType !== 'legal_notice' && 
             eventType !== 'call' && 
             description && (
              <p className="text-sm text-slate-600 mt-2">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
