import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockCases, mockTimelineData } from '@/data/mockData'
import { ArrowLeft, Mail, Phone, FileText, AlertCircle, Scale, User, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Building2, Calendar, DollarSign, ArrowUp, ArrowDown, MoveRight, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { useUIStore } from '@/stores'

const eventIcons = {
  email: Mail,
  call: Phone,
  status_change: FileText,
  payment: AlertCircle,
  legal_notice: Scale
}

const actorColors = {
  fedex: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'FedEx' },
  dca: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', label: 'DCA' },
  customer: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Customer' }
}

export function CaseDetail() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc') // desc = newest first
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false)
  
  const caseData = mockCases.find(c => c.caseId === caseId)
  const timelineRaw = mockTimelineData[caseId || ''] || []
  
  // Sort timeline based on current sort order
  const timeline = [...timelineRaw].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime()
    const dateB = new Date(b.timestamp).getTime()
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
  })

  const toggleEmail = (eventId: string) => {
    const newExpanded = new Set(expandedEmails)
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedEmails(newExpanded)
  }

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  const showToast = useUIStore(state => state.showToast)

  const handleReassign = () => {
    console.log('Reassigning case:', caseId)
    setIsReassignModalOpen(false)
    showToast('Case reassigned successfully', 'success')
    // Simulate delay then navigate
    setTimeout(() => navigate('/case-allocation'), 500)
  }

  // Determine receiver based on actor and event type
  const getReceiver = (actor: 'fedex' | 'dca' | 'customer', eventType: string) => {
    if (eventType === 'status_change' || eventType === 'payment') {
      return null // No specific receiver for these events
    }
    
    // For communications (email, call, legal_notice)
    if (actor === 'fedex') return 'customer'
    if (actor === 'dca') return 'customer'
    if (actor === 'customer') return caseData?.assignedAgency ? 'dca' : 'fedex'
    return null
  }

  if (!caseData) {
    return (
      <div className="p-8">
        <p>Case not found</p>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cases
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{caseData.customerName}</h1>
            <p className="text-slate-500 mt-1">Case ID: {caseData.caseId} • Account: {caseData.accountNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            {caseData.assignedAgency && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReassignModalOpen(true)}
              >
                <Repeat className="h-4 w-4 mr-2" />
                Reassign Case
              </Button>
            )}
            <Badge 
              variant={
                caseData.status === 'legal' ? 'destructive' :
                caseData.status === 'in_progress' ? 'high' :
                caseData.status === 'pending' ? 'warning' :
                'secondary'
              }
              className="text-base px-4 py-2"
            >
              {caseData.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex gap-6 relative">
        {/* Main Timeline Section */}
        <div className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "flex-1" : "flex-1 lg:pr-0"
        )}>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>Case Timeline</CardTitle>
                  <CardDescription>
                    Chronological history of all interactions and status changes
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="ml-4"
                >
                  {sortOrder === 'desc' ? (
                    <>
                      <ArrowDown className="h-4 w-4 mr-2" />
                      Newest First
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Oldest First
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-500">No timeline events available for this case</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline connector line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

                  {/* Timeline events */}
                  <div className="space-y-6">
                    {timeline.map((event) => {
                      const Icon = eventIcons[event.eventType] || FileText
                      const actorStyle = actorColors[event.actor]
                      const isEmail = event.eventType === 'email'
                      const isExpanded = expandedEmails.has(event.id)
                      const receiver = getReceiver(event.actor, event.eventType)
                      const receiverStyle = receiver ? actorColors[receiver as keyof typeof actorColors] : null
                      
                      return (
                        <div key={event.id} className="relative flex gap-4">
                          {/* Icon circle */}
                          <div className={cn(
                            "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 shrink-0",
                            actorStyle.bg,
                            actorStyle.border
                          )}>
                            <Icon className={cn("h-5 w-5", actorStyle.text)} />
                          </div>

                          {/* Event content */}
                          <div className="flex-1 pb-6">
                            <div className={cn(
                              "rounded-lg border-2 transition-all",
                              actorStyle.border,
                              "bg-white",
                              isEmail && "cursor-pointer hover:shadow-md"
                            )}
                            onClick={() => isEmail && toggleEmail(event.id)}
                            >
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <div className="flex items-center gap-1.5">
                                        <Badge 
                                          variant="outline"
                                          className={cn(
                                            "text-xs",
                                            actorStyle.text,
                                            actorStyle.border
                                          )}
                                        >
                                          <User className="h-3 w-3 mr-1" />
                                          {actorStyle.label}
                                        </Badge>
                                        {receiver && receiverStyle && (
                                          <>
                                            <MoveRight className="h-3 w-3 text-slate-400" />
                                            <Badge 
                                              variant="outline"
                                              className={cn(
                                                "text-xs",
                                                receiverStyle.text,
                                                receiverStyle.border
                                              )}
                                            >
                                              <User className="h-3 w-3 mr-1" />
                                              {receiverStyle.label}
                                            </Badge>
                                          </>
                                        )}
                                      </div>
                                      {isEmail && (
                                        <Badge variant="secondary" className="text-xs">
                                          <Mail className="h-3 w-3 mr-1" />
                                          Email
                                        </Badge>
                                      )}
                                    </div>
                                    <h4 className="font-semibold text-slate-900 text-sm">
                                      {event.title}
                                    </h4>
                                  </div>
                                  <div className="flex items-start gap-2 shrink-0">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-slate-400" />
                                      <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                                        {formatDate(event.timestamp)}
                                      </span>
                                    </div>
                                    {isEmail && (
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
                                
                                {/* Email subject preview */}
                                {isEmail && event.metadata?.emailSubject && !isExpanded && (
                                  <p className="text-sm text-slate-600 mt-2">
                                    <span className="font-medium">Subject:</span> {event.metadata.emailSubject}
                                  </p>
                                )}

                                {/* Expanded email content */}
                                {isEmail && isExpanded && (
                                  <div className="mt-3 space-y-3">
                                    {event.metadata?.emailSubject && (
                                      <div className="bg-slate-50 p-3 rounded">
                                        <p className="text-xs text-slate-500 font-medium mb-1">Subject</p>
                                        <p className="text-sm text-slate-900">{event.metadata.emailSubject}</p>
                                      </div>
                                    )}
                                    <div className="bg-slate-50 p-3 rounded">
                                      <p className="text-xs text-slate-500 font-medium mb-1">Message</p>
                                      <p className="text-sm text-slate-700 leading-relaxed">
                                        {event.description}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                      <Button variant="outline" size="sm">
                                        <Mail className="h-3 w-3 mr-2" />
                                        Reply
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        Forward
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* Non-email content */}
                                {!isEmail && (
                                  <p className="text-sm text-slate-600 mt-2">
                                    {event.description}
                                  </p>
                                )}

                                {/* Metadata */}
                                {event.metadata && !isEmail && (
                                  <div className="mt-3 pt-3 border-t border-slate-100">
                                    {event.metadata.amount && (
                                      <p className="text-xs text-slate-500">
                                        <span className="font-medium">Amount:</span> {formatCurrency(event.metadata.amount)}
                                      </p>
                                    )}
                                    {event.metadata.previousStatus && event.metadata.newStatus && (
                                      <p className="text-xs text-slate-500">
                                        <span className="font-medium">Status Change:</span> {event.metadata.previousStatus} → {event.metadata.newStatus}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Collapsible Right Sidebar - Case Overview */}
        <div className={cn(
          "transition-all duration-300 shrink-0",
          sidebarCollapsed ? "w-12" : "w-80"
        )}>
          {!sidebarCollapsed ? (
            <Card className="sticky top-8">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Case Overview</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(true)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Financial Information */}
                <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-medium text-blue-900">Outstanding Amount</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(caseData.amount)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Aging Days</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {caseData.agingDays}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">AI Priority</p>
                    <p className="text-xl font-semibold text-emerald-600">
                      {(caseData.recoveryProbability * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <p className="text-xs font-medium text-slate-500">Customer</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900 pl-6">
                      {caseData.customerName}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <p className="text-xs font-medium text-slate-500">Account Number</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900 pl-6 font-mono">
                      {caseData.accountNumber}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <p className="text-xs font-medium text-slate-500">Due Date</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900 pl-6">
                      {new Date(caseData.dueDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <p className="text-xs font-medium text-slate-500">Last Contact</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900 pl-6">
                      {new Date(caseData.lastContact).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {caseData.assignedAgency && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <p className="text-xs font-medium text-slate-500">Assigned Agency</p>
                      </div>
                      <p className="text-sm font-medium text-slate-900 pl-6">
                        {caseData.assignedAgency}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full"
                    onClick={() => showToast('Email composer opened', 'info')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="sticky top-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="h-full w-12 p-0 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reassign Confirmation Modal */}
      <ConfirmationModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        onConfirm={handleReassign}
        title="Reassign Case?"
        message={`Are you sure you want to reassign case ${caseData.caseId} from ${caseData.assignedAgency}? This will move the case to the assignment queue for redistribution.`}
        confirmText="Reassign Case"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  )
}
