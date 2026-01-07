import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, TrendingUp, Briefcase, ChevronRight, DollarSign, Search, Filter, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { agencyService, type Agency } from '@/services/agencyService'
import { useUIStore } from '@/stores'

export function Agencies() {
  const navigate = useNavigate()
  const showToast = useUIStore((state) => state.showToast)
  const [loading, setLoading] = useState(true)
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    fetchAgencies()
  }, [])

  const fetchAgencies = async () => {
    try {
      setLoading(true)
      const data = await agencyService.getAgencies()
      setAgencies(data)
    } catch (error) {
      console.error('Error fetching agencies:', error)
      showToast('Failed to load agencies', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Filter agencies based on search and performance
  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const matchesSearch = agency.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      let matchesPerformance = true
      if (performanceFilter === 'high') {
        matchesPerformance = (agency.performance_score || 0) >= 0.9
      } else if (performanceFilter === 'medium') {
        matchesPerformance = (agency.performance_score || 0) >= 0.8 && (agency.performance_score || 0) < 0.9
      } else if (performanceFilter === 'low') {
        matchesPerformance = (agency.performance_score || 0) < 0.8
      }
      
      return matchesSearch && matchesPerformance
    })
  }, [agencies, searchQuery, performanceFilter])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading agencies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Collection Agencies</h1>
        <p className="text-slate-500 mt-1">Manage and monitor partner collection agencies</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search agencies by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Performance Filter */}
          <div className="flex items-center gap-2 min-w-50">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
            >
              <option value="all">All Performance</option>
              <option value="high">High (90%+)</option>
              <option value="medium">Medium (80-90%)</option>
              <option value="low">Low (&lt;80%)</option>
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <p className="text-sm text-slate-600">
          Showing {filteredAgencies.length} of {agencies.length} agencies
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Agencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{agencies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Avg Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {agencies.length > 0 ? ((agencies.reduce((sum, a) => sum + (a.performanceScore || a.performance_score || 0), 0) / agencies.length) * 100).toFixed(0) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Active Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(agencies.reduce((sum, a) => sum + (a.activeOutstandingAmount || a.active_outstanding_amount || 0), 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {agencies.reduce((sum, a) => sum + (a.activeCases || a.active_cases || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agencies List */}
      <div className="space-y-4">
        {filteredAgencies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No agencies found matching your criteria</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setPerformanceFilter('all')
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAgencies.map((agency) => (
          <Card 
            key={agency.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-slate-300"
            onClick={() => navigate(`/agency/${agency.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 shrink-0">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {agency.name}
                      </h3>
                      <Badge 
                        variant={
                          (agency.performanceScore || agency.performance_score || 0) >= 0.9 ? 'default' :
                          (agency.performanceScore || agency.performance_score || 0) >= 0.8 ? 'secondary' :
                          'outline'
                        }
                      >
                        {((agency.performanceScore || agency.performance_score || 0) * 100).toFixed(0)}% Performance
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Active Outstanding</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(agency.activeOutstandingAmount || agency.active_outstanding_amount || 0)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Active Cases</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {agency.activeCases || agency.active_cases || 0}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Success Rate</p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {((agency.performanceScore || agency.performance_score || 0) * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="h-5 w-5 text-slate-400 shrink-0 ml-4" />
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>
    </div>
  )
}
