import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// TODO: Replace with actual API calls to dashboardService.getAgencyPerformance()
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

// TODO: Fetch data from API instead of using mock data
const agencies: any[] = [] // mockData.agencies removed - implement API fetch
const performanceData: any[] = [] // Derived from agencies - implement after API fetch

export function AgencyPerformance() {
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
        <h1 className="text-3xl font-bold text-slate-900">Agency Performance</h1>
        <p className="text-slate-500 mt-1">Comprehensive performance metrics for all collection agencies</p>
      </div>

      {/* Performance Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recovery Performance Comparison</CardTitle>
          <CardDescription>Active outstanding amount by agency</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `$${value}k`}
              />
              <Tooltip 
                formatter={(value: number | undefined) => value ? formatCurrency(value * 1000) : ''}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="recovered" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
                name="Active Outstanding"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Agency Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agencies.map((agency) => (
          <Card key={agency.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{agency.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {agency.currentCapacity || 0}/{agency.capacity || 0} capacity
                  </CardDescription>
                </div>
                <Badge 
                  variant={
                    agency.performanceScore >= 0.9 ? 'success' : 
                    agency.performanceScore >= 0.8 ? 'high' : 
                    'medium'
                  }
                >
                  {(agency.performanceScore * 100).toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Active Outstanding</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(agency.activeOutstandingAmount)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Capacity</p>
                  <p className="text-xl font-semibold text-slate-900 mt-1">
                    {agency.currentCapacity || 0} / {agency.capacity || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Utilization</p>
                  <p className="text-xl font-semibold text-slate-900 mt-1">
                    {agency.capacity ? Math.round(((agency.currentCapacity || 0) / agency.capacity) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  {agency.performanceScore >= 0.85 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Above target
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-600 font-medium">
                        Below target
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
