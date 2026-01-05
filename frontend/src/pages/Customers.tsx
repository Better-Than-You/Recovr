import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { customers } from '@/data/mockData'
import { User, MapPin, Phone, Mail, ChevronRight, DollarSign, Briefcase, Search, Filter, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'

export function Customers() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentHistoryFilter, setPaymentHistoryFilter] = useState<'all' | 'excellent' | 'good' | 'fair' | 'poor'>('all')

  // Filter customers based on search and payment history
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.state.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesPaymentHistory = paymentHistoryFilter === 'all' || customer.paymentHistory === paymentHistoryFilter
      
      return matchesSearch && matchesPaymentHistory
    })
  }, [searchQuery, paymentHistoryFilter])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  const getPaymentHistoryBadge = (history: string) => {
    const map = {
      excellent: { variant: 'default' as const, label: 'Excellent' },
      good: { variant: 'secondary' as const, label: 'Good' },
      fair: { variant: 'medium' as const, label: 'Fair' },
      poor: { variant: 'destructive' as const, label: 'Poor' }
    }
    return map[history as keyof typeof map]
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
        <p className="text-slate-500 mt-1">View and manage customer accounts</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, city, or state..."
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

          {/* Payment History Filter */}
          <div className="flex items-center gap-2 min-w-[220px]">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={paymentHistoryFilter}
              onChange={(e) => setPaymentHistoryFilter(e.target.value as 'all' | 'excellent' | 'good' | 'fair' | 'poor')}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
            >
              <option value="all">All Payment History</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <p className="text-sm text-slate-600">
          Showing {filteredCustomers.length} of {customers.length} customers
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{customers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(customers.reduce((sum, c) => sum + c.totalOwed, 0))}
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
              {customers.reduce((sum, c) => sum + c.activeCases, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Excellent History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {customers.filter(c => c.paymentHistory === 'excellent').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No customers found matching your criteria</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setPaymentHistoryFilter('all')
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => {
            const historyBadge = getPaymentHistoryBadge(customer.paymentHistory)
          
            return (
            <Card 
              key={customer.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-slate-300"
              onClick={() => navigate(`/customer/${customer.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 shrink-0">
                      <User className="h-6 w-6 text-slate-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {customer.name}
                        </h3>
                        <Badge variant={historyBadge.variant}>
                          {historyBadge.label} History
                        </Badge>
                        <span className="text-xs text-slate-400 font-mono">
                          {customer.id}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Location</p>
                            <p className="text-sm font-medium text-slate-900">
                              {customer.city}, {customer.state}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Total Owed</p>
                            <p className="text-sm font-semibold text-red-600">
                              {formatCurrency(customer.totalOwed)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Active Cases</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {customer.activeCases}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Last Contact</p>
                            <p className="text-sm font-medium text-slate-900">
                              {new Date(customer.lastContact).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
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
          )
        }))}
      </div>
    </div>
  )
}
