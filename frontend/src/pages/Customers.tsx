import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, MapPin, Phone, ChevronRight, DollarSign, Briefcase, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { customerService, type Customer } from '@/services/customerService'
import { useAuthStore, useUIStore } from '@/stores'

export function Customers() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const showToast = useUIStore((state) => state.showToast)
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // For agency employees, pass their agency_id to filter customers
      const params: any = { limit: 100 }
      
      if (user?.role === 'agency' && user?.agencyId) {
        params.agency_id = user.agencyId
      }
      
      const response = await customerService.getCustomers(params)
      setCustomers(response.customers)
    } catch (error) {
      console.error('Error fetching customers:', error)
      showToast('Failed to load customers', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.accountNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.region || '').toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesSearch
    })
  }, [customers, searchQuery])

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
          <p className="mt-4 text-slate-600">Loading customers...</p>
        </div>
      </div>
    )
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
              placeholder="Search by name, email, account number, or region..."
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
              Total Amount Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(customers.reduce((sum, c) => sum + (c.amountDue || 0), 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              Average Amount Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {customers.length > 0 ? formatCurrency(customers.reduce((sum, c) => sum + (c.amountDue || 0), 0) / customers.length) : '$0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">
              With Outstanding Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {customers.filter(c => (c.amountDue || 0) > 0).length}
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
                onClick={() => setSearchQuery('')}
                className="mt-4"
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
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
                          {customer.customerName}
                        </h3>
                        {customer.customerEmail && (
                          <span className="text-sm text-slate-500">
                            {customer.customerEmail}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">
                          {customer.accountNumber}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        {customer.region && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Region</p>
                              <p className="text-sm font-medium text-slate-900">
                                {customer.region}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Amount Due</p>
                            <p className="text-sm font-semibold text-red-600">
                              {formatCurrency(customer.amountDue || 0)}
                            </p>
                          </div>
                        </div>
                        
                        {customer.accountType && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Account Type</p>
                              <p className="text-sm font-medium text-slate-900">
                                {customer.accountType}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {customer.customerTier && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Tier</p>
                              <p className="text-sm font-medium text-slate-900">
                                {customer.customerTier}
                              </p>
                            </div>
                          </div>
                        )}
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
