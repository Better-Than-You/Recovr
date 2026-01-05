import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockCases, mockTimelineData } from '@/data/mockData'
import { ArrowLeft, Mail, Phone, FileText, AlertCircle, Scale, User } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  
  const caseData = mockCases.find(c => c.caseId === caseId)
  const timeline = mockTimelineData[caseId || ''] || []

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Case Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Outstanding Amount</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(caseData.amount)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Aging Days</p>
                  <p className="text-xl font-semibold text-slate-900 mt-1">
                    {caseData.agingDays}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">AI Priority</p>
                  <p className="text-xl font-semibold text-slate-900 mt-1">
                    {(caseData.recoveryProbability * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">Due Date</p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {new Date(caseData.dueDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Last Contact</p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {new Date(caseData.lastContact).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {caseData.assignedAgency && (
                <div>
                  <p className="text-sm text-slate-500">Assigned Agency</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {caseData.assignedAgency}
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Button className="w-full">Take Action</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Case Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Case Timeline</CardTitle>
              <CardDescription>
                Chronological history of all interactions and status changes
              </CardDescription>
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
                      
                      return (
                        <div key={event.id} className="relative flex gap-4">
                          {/* Icon circle */}
                          <div className={cn(
                            "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2",
                            actorStyle.bg,
                            actorStyle.border
                          )}>
                            <Icon className={cn("h-5 w-5", actorStyle.text)} />
                          </div>

                          {/* Event content */}
                          <div className="flex-1 pb-6">
                            <div className={cn(
                              "rounded-lg border-2 p-4",
                              actorStyle.border,
                              "bg-white"
                            )}>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
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
                                    <span className="text-xs text-slate-400">
                                      {formatDate(event.timestamp)}
                                    </span>
                                  </div>
                                  <h4 className="font-semibold text-slate-900 text-sm">
                                    {event.title}
                                  </h4>
                                </div>
                              </div>
                              
                              <p className="text-sm text-slate-600 mt-2">
                                {event.description}
                              </p>

                              {/* Metadata */}
                              {event.metadata && (
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                  {event.metadata.emailSubject && (
                                    <p className="text-xs text-slate-500">
                                      <span className="font-medium">Subject:</span> {event.metadata.emailSubject}
                                    </p>
                                  )}
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
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
