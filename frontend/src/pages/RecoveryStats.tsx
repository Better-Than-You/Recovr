import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockCases } from '@/data/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target, Clock } from 'lucide-react'
import { act } from 'react'

export function RecoveryStats() {
  const myCases = mockCases.filter(c => c.assignedAgency === 'Premier Recovery Solutions')
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  const totalTarget = 2500000
  const activeOutstandingAmount = 2100000
  const recoveryRate = (activeOutstandingAmount / totalTarget) * 100

  const agingDistribution = [
    { range: '0-30', count: myCases.filter(c => c.agingDays <= 30).length },
    { range: '31-60', count: myCases.filter(c => c.agingDays > 30 && c.agingDays <= 60).length },
    { range: '61-90', count: myCases.filter(c => c.agingDays > 60 && c.agingDays <= 90).length },
    { range: '90-120', count: myCases.filter(c => c.agingDays > 90 && c.agingDays <= 120).length },
    { range: '120+', count: myCases.filter(c => c.agingDays > 120).length }
  ]

  const statusDistribution = [
    { name: 'In Progress', value: myCases.filter(c => c.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Legal', value: myCases.filter(c => c.status === 'legal').length, color: '#ef4444' },
    { name: 'Assigned', value: myCases.filter(c => c.status === 'assigned').length, color: '#94a3b8' }
  ]

  const monthlyRecovery = [
    { month: 'Aug', amount: 310000 },
    { month: 'Sep', amount: 385000 },
    { month: 'Oct', amount: 420000 },
    { month: 'Nov', amount: 465000 },
    { month: 'Dec', amount: 390000 },
    { month: 'Jan', amount: 520000 }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Recovery Statistics</h1>
        <p className="text-slate-500 mt-1">Performance metrics and recovery analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Active Outstanding
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(activeOutstandingAmount)}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Recovery Rate
            </CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {recoveryRate.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Target: {formatCurrency(totalTarget)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Avg. Resolution Time
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">42 days</div>
            <p className="text-xs text-slate-500 mt-1">
              -8 days from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Recovery Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recovery Trend</CardTitle>
            <CardDescription>Recovery amounts over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRecovery}>
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
                <Bar 
                  dataKey="amount" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                  name="Recovered"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Aging Bucket Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Aging Bucket Distribution</CardTitle>
            <CardDescription>Cases by days overdue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="range" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#8b5cf6" 
                  radius={[8, 8, 0, 0]}
                  name="Cases"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Target vs Actual Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Target vs Actual Performance</CardTitle>
          <CardDescription>Current quarter recovery progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Quarterly Target</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(activeOutstandingAmount)} / {formatCurrency(totalTarget)}
                </span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${recoveryRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant={recoveryRate >= 85 ? 'success' : recoveryRate >= 70 ? 'high' : 'warning'}>
                  {recoveryRate.toFixed(1)}% Complete
                </Badge>
                <span className="text-xs text-slate-500">
                  {formatCurrency(totalTarget - activeOutstandingAmount)} remaining
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              {statusDistribution.map((status) => (
                <div key={status.name} className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: status.color }}
                  >
                    {status.value}
                  </div>
                  <p className="text-xs text-slate-600">{status.name}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
