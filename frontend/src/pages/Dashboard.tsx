import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { dashboardStats, mockCases, agencies } from '@/data/mockData'
import { DollarSign, TrendingUp, Users, Clock, Radio, Zap, AlertCircle, CheckCircle2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const recoveryTrendData = [
  { month: 'Aug', recovered: 420000, target: 450000 },
  { month: 'Sep', recovered: 510000, target: 500000 },
  { month: 'Oct', recovered: 580000, target: 550000 },
  { month: 'Nov', recovered: 625000, target: 600000 },
  { month: 'Dec', recovered: 590000, target: 650000 },
  { month: 'Jan', recovered: 710000, target: 700000 }
]

const agingBucketData = [
  { bucket: '0-30', count: 15, amount: 234000 },
  { bucket: '31-60', count: 28, amount: 512000 },
  { bucket: '61-90', count: 42, amount: 1120000 },
  { bucket: '90+', count: 42, amount: 2657400 }
]

export function Dashboard() {
  const navigate = useNavigate()
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isAutoAssignModalOpen, setIsAutoAssignModalOpen] = useState(false)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  
  // Simulate live updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Get new unassigned cases
  const newCases = mockCases.filter(c => c.status === 'pending' && !c.assignedAgency)
  
  // Calculate hours since case creation
  const getHoursSinceCreation = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
  }
  
  // Format hours in a readable way
  const formatHours = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.floor(hours * 60)
      return `${minutes}m`
    } else if (hours < 24) {
      return `${hours}h`
    } else {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
    }
  }
  
  // Auto-assign cases past their individual thresholds
  const handleAutoAssignAll = () => {
    const casesToAssign = newCases.filter(c => {
      const threshold = c.autoAssignAfterHours || 24
      return getHoursSinceCreation(c.createdAt) >= threshold
    })
    console.log(`Auto-assigning ${casesToAssign.length} cases`)
    setIsAutoAssignModalOpen(false)
    // In real app, this would make API call
  }
  
  const handleManualAssign = (caseId: string) => {
    navigate(`/case/${caseId}`)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="p-8">
      {/* Header with Live Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Global Dashboard</h1>
            <p className="text-slate-500 mt-1">Overview of debt collection operations</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Radio className="h-4 w-4 text-green-500 animate-pulse" />
            <span>Live Updates</span>
            <span className="text-slate-400">•</span>
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* New Cases Section */}
      {newCases.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <CardTitle>New Unassigned Cases</CardTitle>
                <Badge variant="high" className="ml-2">{newCases.length}</Badge>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAutoAssignModalOpen(true)}
                  disabled={newCases.filter(c => {
                    const threshold = c.autoAssignAfterHours || 24
                    return getHoursSinceCreation(c.createdAt) >= threshold
                  }).length === 0}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Auto Assign All
                </Button>
              </div>
            </div>
            <CardDescription>
              Cases pending assignment • Auto-assign triggers vary by case priority
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {newCases.map((caseItem) => {
                const hoursSince = getHoursSinceCreation(caseItem.createdAt)
                const autoAssignThreshold = caseItem.autoAssignAfterHours || 24
                const willAutoAssignIn = Math.max(0, autoAssignThreshold - hoursSince)
                const isOverdue = hoursSince >= autoAssignThreshold
                const hoursOverdue = hoursSince - autoAssignThreshold
                
                return (
                  <div 
                    key={caseItem.caseId}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-900">{caseItem.customerName}</p>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Auto-assign ready
                          </Badge>                        )}
                        <Badge variant="outline" className="text-xs">
                          Trigger: {formatHours(autoAssignThreshold)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="font-mono text-xs">{caseItem.caseId}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(caseItem.amount)}</span>
                        <span>•</span>
                        <span className="text-xs">
                          {isOverdue ? (
                            <span className="text-red-600 font-medium">
                              {formatHours(hoursOverdue)} overdue
                            </span>
                          ) : (
                            <span>Auto-assign in {formatHours(willAutoAssignIn)}</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          caseItem.recoveryProbability >= 0.8 ? 'success' : 
                          caseItem.recoveryProbability >= 0.6 ? 'high' : 
                          'warning'
                        }
                      >
                        {(caseItem.recoveryProbability * 100).toFixed(0)}% Recovery
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleManualAssign(caseItem.caseId)}
                      >
                        Manual Assign
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Outstanding
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(dashboardStats.totalOutstanding)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Across {dashboardStats.pendingCases} cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Recovery Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {(dashboardStats.recoveryRate * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-green-600 mt-1">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Active Agencies
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardStats.activeAgencies}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Managing {mockCases.filter(c => c.assignedAgency).length} assigned cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Avg. Recovery Time
            </CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardStats.averageRecoveryTime} days
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {dashboardStats.resolvedThisMonth} resolved this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recovery Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Trend</CardTitle>
            <CardDescription>Monthly recovery vs. target (Last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recoveryTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: number | undefined) => value ? formatCurrency(value) : ''}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="recovered" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Recovered"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Aging Bucket Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Aging Bucket Distribution</CardTitle>
            <CardDescription>Outstanding amounts by days overdue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agingBucketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="bucket" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: number | undefined) => value ? formatCurrency(value) : ''}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                  name="Amount"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agency Performance Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Agency Performance Ranking</CardTitle>
          <CardDescription>Top performing collection agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agencies.map((agency, index) => (
              <div key={agency.id} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-sm font-bold text-slate-700">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{agency.name}</p>
                  <p className="text-xs text-slate-500">
                    {agency.activeCases} active cases
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(agency.totalRecovered)}
                  </p>
                  <Badge 
                    variant={
                      agency.performanceScore >= 0.9 ? 'success' : 
                      agency.performanceScore >= 0.8 ? 'high' : 
                      'medium'
                    }
                    className="mt-1"
                  >
                    {(agency.performanceScore * 100).toFixed(0)}% Score
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto Assign Confirmation Modal */}
      <ConfirmationModal
        isOpen={isAutoAssignModalOpen}
        onClose={() => setIsAutoAssignModalOpen(false)}
        onConfirm={handleAutoAssignAll}
        title="Auto-Assign Cases?"
        message={`This will automatically assign ${newCases.filter(c => {
          const threshold = c.autoAssignAfterHours || 24
          return getHoursSinceCreation(c.createdAt) >= threshold
        }).length} case(s) that have exceeded their auto-assign threshold to the best available collection agency based on performance scores and workload.`}
        confirmText="Auto-Assign"
        cancelText="Cancel"
        type="info"
      />
    </div>
  )
}
