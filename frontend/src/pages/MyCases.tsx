import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Clock, AlertCircle } from 'lucide-react'
import { caseService, type Case } from '@/services/caseService'
import { useAuthStore, useUIStore } from '@/stores'

export function MyCases() {
  const navigate = useNavigate()
  const showToast = useUIStore((state) => state.showToast)
  const user = useAuthStore((state) => state.user)
  const [loading, setLoading] = useState(true)
  const [myCases, setMyCases] = useState<Case[]>([])

  useEffect(() => {
    fetchMyCases()
  }, [])

  const fetchMyCases = async () => {
    try {
      setLoading(true)
      // For agency role, filter cases by their agency ID
      const params: any = { limit: 100 }
      
      if (user?.role === 'agency' && user?.agencyId) {
        params.agency_id = user.agencyId
      }
      
      const response = await caseService.getCases(params)
      setMyCases(response.cases)
    } catch (error) {
      console.error('Error fetching cases:', error)
      showToast('Failed to load cases', 'error')
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

  const totalAssigned = myCases.length
  const totalAmount = myCases.reduce((sum, c) => sum + (c.invoiceAmount || 0), 0)
  const recoveredAmount = myCases.reduce((sum, c) => sum + (c.recoveredAmount || 0), 0)
  const urgentCases = myCases.filter(c => (c.agingDays || 0) > 120).length

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading cases...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Assigned Cases</h1>
        <p className="text-slate-500 mt-1">Cases assigned to your agency</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalAssigned}</div>
            <p className="text-xs text-slate-500 mt-1">Active cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Outstanding debt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Urgent Cases
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentCases}</div>
            <p className="text-xs text-slate-500 mt-1">120+ days overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Assigned Cases</CardTitle>
          <CardDescription>{myCases.length} cases requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Aging (Days)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myCases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell className="font-mono text-sm">
                    {caseItem.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{caseItem.customerName}</p>
                      <p className="text-xs text-slate-500">{caseItem.customerId || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(caseItem.invoiceAmount || 0)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={
                        (caseItem.agingDays || 0) > 120 ? 'text-red-600 font-semibold' :
                        (caseItem.agingDays || 0) > 90 ? 'text-orange-600 font-medium' :
                        'text-slate-600'
                      }>
                        {caseItem.agingDays || 0}
                      </span>
                      {(caseItem.agingDays || 0) > 120 && (
                        <Clock className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        caseItem.status === 'legal' ? 'destructive' :
                        caseItem.status === 'in_progress' ? 'high' :
                        'secondary'
                      }
                    >
                      {caseItem.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {caseItem.createdAt ? new Date(caseItem.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/case/${caseItem.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
