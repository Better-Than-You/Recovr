import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, User, RefreshCw, Send } from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
  type: 'assignment' | 'status_change' | 'communication' | 'system'
}

const auditLogs: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2024-01-06T15:30:00Z',
    user: 'admin@fedex.com',
    action: 'Case Assigned',
    details: 'Assigned CS-2024-004 to Elite Collection Agency',
    type: 'assignment'
  },
  {
    id: 'log-002',
    timestamp: '2024-01-06T14:15:00Z',
    user: 'agent@dca.com',
    action: 'Status Updated',
    details: 'Changed CS-2024-001 status from assigned to in_progress',
    type: 'status_change'
  },
  {
    id: 'log-003',
    timestamp: '2024-01-06T13:45:00Z',
    user: 'agent@dca.com',
    action: 'Email Sent',
    details: 'Payment reminder sent to Acme Corporation',
    type: 'communication'
  },
  {
    id: 'log-004',
    timestamp: '2024-01-06T12:20:00Z',
    user: 'system',
    action: 'Auto-Escalation',
    details: 'CS-2024-007 auto-escalated after 90 days',
    type: 'system'
  },
  {
    id: 'log-005',
    timestamp: '2024-01-06T11:00:00Z',
    user: 'admin@fedex.com',
    action: 'Bulk Assignment',
    details: 'Assigned 5 cases to Premier Recovery Solutions',
    type: 'assignment'
  },
  {
    id: 'log-006',
    timestamp: '2024-01-06T10:30:00Z',
    user: 'agent@dca.com',
    action: 'Call Logged',
    details: 'Phone contact with Global Logistics Inc',
    type: 'communication'
  },
  {
    id: 'log-007',
    timestamp: '2024-01-06T09:15:00Z',
    user: 'admin@fedex.com',
    action: 'Status Updated',
    details: 'Marked CS-2024-003 as legal proceedings',
    type: 'status_change'
  },
  {
    id: 'log-008',
    timestamp: '2024-01-05T16:45:00Z',
    user: 'system',
    action: 'Report Generated',
    details: 'Monthly performance report generated',
    type: 'system'
  }
]

const logTypeIcons = {
  assignment: User,
  status_change: RefreshCw,
  communication: Send,
  system: FileText
}

const logTypeBadges = {
  assignment: 'high' as const,
  status_change: 'warning' as const,
  communication: 'secondary' as const,
  system: 'medium' as const
}

export function AuditLogs() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
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
        <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-slate-500 mt-1">Complete audit trail of all system activities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {auditLogs.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {auditLogs.filter(log => log.type === 'assignment').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Status Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {auditLogs.filter(log => log.type === 'status_change').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {auditLogs.filter(log => log.type === 'communication').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Detailed log of all system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => {
                const Icon = logTypeIcons[log.type]
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-slate-600">
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {log.user}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {log.action}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {log.details}
                    </TableCell>
                    <TableCell>
                      <Badge variant={logTypeBadges[log.type]}>
                        {log.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
