import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { DollarSign, TrendingUp, Users, Clock, Radio, Zap, AlertCircle, Upload, FileSpreadsheet } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { dashboardService, type DashboardStats } from '@/services/dashboardService'
import { caseService, type Case } from '@/services/caseService'
import { agencyService, type Agency } from '@/services/agencyService'
import { useUIStore } from '@/stores'
import api from '@/services/api'

const agingBucketData = [
  { bucket: '0-30', count: 15, amount: 234000 },
  { bucket: '31-60', count: 28, amount: 512000 },
  { bucket: '61-90', count: 42, amount: 1120000 },
  { bucket: '90+', count: 42, amount: 2657400 }
]

export function Dashboard() {
  const navigate = useNavigate()
  const showToast = useUIStore((state) => state.showToast)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isAutoAssignModalOpen, setIsAutoAssignModalOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [cases, setCases] = useState<Case[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [recoveryTrendData, setRecoveryTrendData] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData(true)
  }, [])
  
  const fetchDashboardData = async (isInitial = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true)
      }
      const [statsData, casesData, agenciesData, recoveryData] = await Promise.all([
        dashboardService.getDashboardStats(),
        caseService.getCases({ status: 'pending', limit: 100 }),
        agencyService.getAgencies(),
        dashboardService.getRecoveryStats()
      ])
      
      setStats(statsData)
      setCases(casesData.cases)
      setAgencies(agenciesData)
      setRecoveryTrendData(recoveryData.map(r => ({ 
        month: r.month, 
        recovered: r.recovered, 
        target: r.recovered * 1.1 
      })))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showToast('Failed to load dashboard data', 'error')
    } finally {
      if (isInitial) {
        setInitialLoading(false)
      }
    }
  }
  
  // Simulate live updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      fetchDashboardData() // Refresh data
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // Get new unassigned cases
  // const newCases = cases.filter(c => c.status === 'pending' && !c.assigned_agency_id)
  
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
  // const handleAutoAssignAll = async () => {
  //   try {
  //     const casesToAssign = newCases.filter(c => {
  //       const threshold = 24 // Default threshold
  //       return getHoursSinceCreation(c.created_at) >= threshold
  //     })
      
  //     // Assign each case to best agency (simplified)
  //     for (const caseItem of casesToAssign) {
  //       const bestAgency = agencies.sort((a, b) => 
  //         (b.performance_score || 0) - (a.performance_score || 0)
  //       )[0]
        
  //       if (bestAgency) {
  //         await caseService.assignCase(caseItem.id, bestAgency.id)
  //       }
  //     }
      
  //     showToast(`Successfully assigned ${casesToAssign.length} cases`, 'success')
  //     setIsAutoAssignModalOpen(false)
  //     fetchDashboardData() // Refresh data
  //   } catch (error) {
  //     console.error('Error auto-assigning cases:', error)
  //     showToast('Failed to auto-assign cases', 'error')
  //   }
  // }
  
  // const handleManualAssign = (caseId: string) => {
  //   navigate(`/case/${caseId}`)
  // }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      showToast('Please upload a valid CSV or Excel file', 'error')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/actions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }) 

      const { message, cases_created, errors } = response.data
      showToast(message || `Successfully imported ${cases_created} case(s)`, 'success')
      
      if (errors && errors.length > 0) {
        console.warn('Import warnings:', errors)
      }
      
      // Refresh dashboard data
      fetchDashboardData()
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: any) {
      console.error('Error uploading file:', error)
      const errorMessage = error.response?.data?.error || 'Failed to upload file'
      showToast(errorMessage, 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(Math.round(value))
  }

  if (initialLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
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

      {/* File Upload Section */}
      <Card className="mb-8 border-dashed border-2 border-slate-300 bg-slate-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">Import Case Data</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Upload CSV or Excel file to import existing case data into the system
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload File</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Cases Section
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
                    const threshold = 24
                    return getHoursSinceCreation(c.created_at) >= threshold
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
                const hoursSince = getHoursSinceCreation(caseItem.created_at)
                const autoAssignThreshold = 24 // Default threshold
                const willAutoAssignIn = Math.max(0, autoAssignThreshold - hoursSince)
                const isOverdue = hoursSince >= autoAssignThreshold
                const hoursOverdue = hoursSince - autoAssignThreshold
                
                return (
                  <div 
                    key={caseItem.id}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-900">{caseItem.customer_name}</p>
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
                        <span className="font-mono text-xs">{caseItem.id}</span>
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
                          caseItem.recovery_probability >= 0.8 ? 'success' : 
                          caseItem.recovery_probability >= 0.6 ? 'high' : 
                          'warning'
                        }
                      >
                        {(caseItem.recovery_probability * 100).toFixed(0)}% Recovery
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleManualAssign(caseItem.id)}
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
      )} */}

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
              {formatCurrency(stats?.totalDebt || 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Across {stats?.totalCases || 0} cases
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
              {(stats?.recoveryRate || 0).toFixed(0)}%
            </div>
            <p className="text-xs text-green-600 mt-1">
              {formatCurrency((stats?.recoveredAmount|| 0) / 1000) }k / {formatCurrency((stats?.totalDebt || 0) / 1000)}k recovered
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
              {agencies.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Managing {cases.filter(c => c.assignedAgency).length} assigned cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Active Cases
            </CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.activeCases || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stats?.resolvedCases || 0} resolved
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
                  tickFormatter={(value) => `${value / 1000}k`}
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
                  tickFormatter={(value) => `${value / 1000}k`}
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
          <CardDescription>Top 10 performing collection agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
            {agencies
              .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
              .slice(0, 10)
              .map((agency, index) => (
              <div key={agency.id} className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  index === 0 ? 'bg-yellow-100' :
                  index === 1 ? 'bg-slate-200' :
                  index === 2 ? 'bg-orange-100' :
                  'bg-slate-100'
                }`}>
                  <span className={`text-sm font-bold ${
                    index === 0 ? 'text-yellow-700' :
                    index === 1 ? 'text-slate-700' :
                    index === 2 ? 'text-orange-700' :
                    'text-slate-700'
                  }`}>#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{agency.name}</p>
                  <p className="text-xs text-slate-500">
                    {agency.active_cases || 0} active cases
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={
                      (agency.performanceScore || 0) >= 0.9 ? 'success' : 
                      (agency.performanceScore || 0) >= 0.8 ? 'high' : 
                      'medium'
                    }
                    className="mt-1"
                  >
                    {(( agency.performanceScore || 0) * 100 )}% Score
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto Assign Confirmation Modal */}
      {/* <ConfirmationModal
        isOpen={isAutoAssignModalOpen}
        onClose={() => setIsAutoAssignModalOpen(false)}
        onConfirm={handleAutoAssignAll}
        title="Auto-Assign Cases?"
        message={`This will automatically assign ${newCases.filter(c => {
          const threshold = 24
          return getHoursSinceCreation(c.created_at) >= threshold
        }).length} case(s) that have exceeded their auto-assign threshold to the best available collection agency based on performance scores and workload.`}
        confirmText="Auto-Assign"
        cancelText="Cancel"
        type="info"
      /> */}
    </div>
  )
}
