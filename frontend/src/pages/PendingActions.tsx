import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PendingActions() {
  const navigate = useNavigate()
  
  // Simulate pending actions
  const pendingActions = [
    { caseId: 'CS-2024-001', customer: 'Acme Corporation', action: 'Follow up call required', priority: 'high', dueIn: '2 hours' },
    { caseId: 'CS-2024-003', customer: 'Midwest Manufacturing', action: 'Legal documentation review', priority: 'urgent', dueIn: 'Overdue' },
    { caseId: 'CS-2024-006', customer: 'Northern Distributors', action: 'Payment plan proposal', priority: 'medium', dueIn: '1 day' },
    { caseId: 'CS-2024-008', customer: 'Pacific Imports LLC', action: 'Send reminder email', priority: 'low', dueIn: '3 days' }
  ]

  const getPriorityBadge = (priority: string) => {
    const map = {
      urgent: { variant: 'destructive' as const, label: 'URGENT' },
      high: { variant: 'high' as const, label: 'High' },
      medium: { variant: 'medium' as const, label: 'Medium' },
      low: { variant: 'low' as const, label: 'Low' }
    }
    return map[priority as keyof typeof map]
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
          return (
            <Card 
              key={action.caseId}
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
                      {action.customer}
                    </h3>
                    <p className="text-slate-600">{action.action}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span className={
                          action.dueIn === 'Overdue' ? 'text-red-600 font-semibold' :
                          action.dueIn.includes('hour') ? 'text-orange-600 font-medium' :
                          'text-slate-600'
                        }>
                          {action.dueIn}
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
