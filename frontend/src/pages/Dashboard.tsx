import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { dashboardStats, mockCases, agencies } from '@/data/mockData'
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react'
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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Global Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of debt collection operations</p>
      </div>

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
    </div>
  )
}
