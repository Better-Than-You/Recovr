import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { mockCases, agencies, type Case } from '@/data/mockData'
import { Filter, Search, ArrowUpDown } from 'lucide-react'

export function CaseAllocation() {
  const navigate = useNavigate()
  const [selectedCases, setSelectedCases] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortField, setSortField] = useState<keyof Case>('agingDays')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  const getPriorityBadge = (probability: number) => {
    if (probability >= 0.85) return { variant: 'high' as const, label: 'High' }
    if (probability >= 0.65) return { variant: 'medium' as const, label: 'Medium' }
    return { variant: 'low' as const, label: 'Low' }
  }

  const getStatusBadge = (status: Case['status']) => {
    const statusMap = {
      pending: { variant: 'warning' as const, label: 'Pending' },
      assigned: { variant: 'secondary' as const, label: 'Assigned' },
      in_progress: { variant: 'high' as const, label: 'In Progress' },
      resolved: { variant: 'success' as const, label: 'Resolved' },
      legal: { variant: 'destructive' as const, label: 'Legal' }
    }
    return statusMap[status]
  }

  const toggleCaseSelection = (caseId: string) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    )
  }

  const toggleSort = (field: keyof Case) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  let filteredCases = [...mockCases]
  
  if (filterStatus !== 'all') {
    filteredCases = filteredCases.filter(c => c.status === filterStatus)
  }

  filteredCases.sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const modifier = sortDirection === 'asc' ? 1 : -1
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * modifier
    }
    return 0
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Case Allocation</h1>
        <p className="text-slate-500 mt-1">Manage and assign overdue accounts to collection agencies</p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search cases..."
              className="h-10 w-64 rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="legal">Legal</option>
            </select>
          </div>
        </div>

        {selectedCases.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              {selectedCases.length} case{selectedCases.length !== 1 ? 's' : ''} selected
            </span>
            <select
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
              onChange={(e) => {
                if (e.target.value) {
                  alert(`Assigning ${selectedCases.length} case(s) to ${e.target.value}`)
                  setSelectedCases([])
                }
              }}
            >
              <option value="">Assign to Agency...</option>
              {agencies.map(agency => (
                <option key={agency.id} value={agency.name}>{agency.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Overdue Accounts</CardTitle>
          <CardDescription>
            {filteredCases.length} cases • Total outstanding: {formatCurrency(
              filteredCases.reduce((sum, c) => sum + c.amount, 0)
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                    onChange={() => {
                      if (selectedCases.length === filteredCases.length) {
                        setSelectedCases([])
                      } else {
                        setSelectedCases(filteredCases.map(c => c.caseId))
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleSort('agingDays')}
                >
                  <div className="flex items-center gap-1">
                    Aging (Days) <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleSort('recoveryProbability')}
                >
                  <div className="flex items-center gap-1">
                    AI Priority <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Agency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((caseItem) => {
                const priority = getPriorityBadge(caseItem.recoveryProbability)
                const status = getStatusBadge(caseItem.status)
                
                return (
                  <TableRow key={caseItem.caseId}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCases.includes(caseItem.caseId)}
                        onChange={() => toggleCaseSelection(caseItem.caseId)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {caseItem.caseId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{caseItem.customerName}</p>
                        <p className="text-xs text-slate-500">{caseItem.accountNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(caseItem.amount)}
                    </TableCell>
                    <TableCell>
                      <span className={
                        caseItem.agingDays > 120 ? 'text-red-600 font-semibold' :
                        caseItem.agingDays > 90 ? 'text-orange-600 font-medium' :
                        'text-slate-600'
                      }>
                        {caseItem.agingDays}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priority.variant}>
                        {priority.label} ({(caseItem.recoveryProbability * 100).toFixed(0)}%)
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {caseItem.assignedAgency || '—'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/case/${caseItem.caseId}`)}
                      >
                        View Details
                      </Button>
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
