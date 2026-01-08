import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { caseService, type Case } from '@/services/caseService'
import { agencyService, type Agency } from '@/services/agencyService'
import { Filter, Search, ArrowUpDown, Loader2 } from 'lucide-react'

export function CaseAllocation() {
  const navigate = useNavigate()
  const [cases, setCases] = useState<Case[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<keyof Case>('agingDays')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Fetch cases and agencies
  useEffect(() => {
    fetchData()
  }, [filterStatus])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [casesData, agenciesData] = await Promise.all([
        caseService.getCases({ 
          status: filterStatus !== 'all' ? filterStatus : undefined,
          limit: 1000 // Get all cases for now
        }),
        agencyService.getAgencies()
      ])
      setCases(casesData.cases)
      setAgencies(agenciesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'warning' | 'secondary' | 'high' | 'success' | 'destructive', label: string }> = {
      pending: { variant: 'warning' as const, label: 'Pending' },
      assigned: { variant: 'secondary' as const, label: 'Assigned' },
      in_progress: { variant: 'high' as const, label: 'In Progress' },
      resolved: { variant: 'success' as const, label: 'Resolved' },
      legal: { variant: 'destructive' as const, label: 'Legal' }
    }
    return statusMap[status] || { variant: 'secondary' as const, label: status }
  }

  const toggleSort = (field: keyof Case) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Filter cases based on search query
  const filteredCases = cases.filter((caseItem) => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    const customerName = caseItem.customerName?.toLowerCase() || ''
    const customerId = caseItem.customerId?.toLowerCase() || ''
    const caseId = caseItem.caseId?.toLowerCase() || ''
    const assignedAgency = caseItem.assignedAgency?.toLowerCase() || ''
    
    return customerName.includes(query) || 
           customerId.includes(query) || 
           caseId.includes(query) ||
           assignedAgency.includes(query)
  })

  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
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

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by case ID, customer name, customer ID, or agency name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
            />
          </div>

          {/* Performance Filter */}
          <div className="flex items-center gap-2 min-w-50">
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
      </div>


      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Overdue Accounts</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : (
              <>
                {sortedCases.length} cases • Total outstanding: {formatCurrency(
                  sortedCases.reduce((sum, c) => sum + c.invoiceAmount - c.recoveredAmount, 0)
                )}
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : sortedCases.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No cases found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                    className="cursor-pointer hover:bg-slate-50 text-center"
                    onClick={() => toggleSort('agingDays')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Aging (Days) <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-50 text-center"
                    onClick={() => toggleSort('recoveryProbability')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      AI Priority <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Assigned Agency</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCases.map((caseItem, index) => {
                  const priority = getPriorityBadge(caseItem.recoveryProbability)
                  const status = getStatusBadge(caseItem.status)
                  
                  return (
                    <TableRow 
                      key={caseItem.id || `case-${index}`}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => navigate(`/case/${caseItem.id}`)}
                    >
                      <TableCell className="font-mono text-sm">
                        {caseItem.caseId}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{caseItem.customerName}</p>
                          <p className="text-xs text-slate-500">{caseItem.customerId || '—'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(caseItem.invoiceAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={
                          caseItem.agingDays > 120 ? 'text-red-600 font-semibold' :
                          caseItem.agingDays > 90 ? 'text-orange-600 font-medium' :
                          'text-slate-600'
                        }>
                          {caseItem.agingDays}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={priority.variant}>
                          {priority.label} ({(caseItem.recoveryProbability * 100).toFixed(0)}%)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {caseItem.assignedAgency || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {caseItem.assignedAgencyReason || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/case/${caseItem.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
