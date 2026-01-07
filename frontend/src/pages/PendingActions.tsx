import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { actionsService, type PendingAction } from '@/services/actionsService'
import { useUIStore } from '@/stores'

export function PendingActions() {
  const navigate = useNavigate()
  const showToast = useUIStore((state) => state.showToast)
  const [loading, setLoading] = useState(true)
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([])

  useEffect(() => {
    fetchPendingActions()
  }, [])

  const fetchPendingActions = async () => {
    try {
      setLoading(true)
      const data = await actionsService.getPendingActions()
      setPendingActions(data)
    } catch (error) {
      console.error('Error fetching pending actions:', error)
      showToast('Failed to load pending actions', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const map = {
      urgent: { variant: 'destructive' as const, label: 'URGENT' },
      high: { variant: 'high' as const, label: 'High' },
      medium: { variant: 'medium' as const, label: 'Medium' },
      low: { variant: 'low' as const, label: 'Low' }
    }
    return map[priority as keyof typeof map]
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading pending actions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Pending Actions</h1>
        <p className="text-slate-500 mt-1">Tasks requiring your immediate attention</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingActions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Urgent
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pendingActions.filter(a => a.priority === 'urgent').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Due Today
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions List */}
      <div className="space-y-4">
        {pendingActions.map((action) => {
          const priority = getPriorityBadge(action.priority)
          // Calculate due date display
          const dueDate = new Date(action.dueDate)
          const now = new Date()
          const diffHours = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60))
          const diffDays = Math.floor(diffHours / 24)
          const dueDisplay = diffHours < 0 ? 'Overdue' : 
                            diffHours < 24 ? `${diffHours} hours` : 
                            `${diffDays} days`
          
          return (
            <Card 
              key={action.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-slate-300"
              onClick={() => navigate(`/case/${action.caseId}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={priority.variant}>
                        {priority.label}
                      </Badge>
                      <span className="font-mono text-sm text-slate-600">
                        {action.caseId}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-slate-600">{action.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span className={
                          dueDisplay === 'Overdue' ? 'text-red-600 font-semibold' :
                          dueDisplay.includes('hour') ? 'text-orange-600 font-medium' :
                          'text-slate-600'
                        }>
                          {dueDisplay}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
