import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, DollarSign, Briefcase, Mail, MapPin, Calendar, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { customerService, type Customer } from '@/services/customerService'
import { type Case } from '@/services/caseService'
import { useUIStore } from '@/stores'

export function CustomerDetail() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const showToast = useUIStore((state) => state.showToast)
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [customerCases, setCustomerCases] = useState<Case[]>([])

  useEffect(() => {
    if (customerId) {
      fetchCustomerData()
    }
  }, [customerId])

  const fetchCustomerData = async () => {
    if (!customerId) return
    
    try {
      setLoading(true)
      const [customerData, casesData] = await Promise.all([
        customerService.getCustomerById(customerId),
        customerService.getCustomerCases(customerId)
      ])
      setCustomer(customerData)
      setCustomerCases(casesData)
    } catch (error) {
      console.error('Failed to fetch customer data:', error)
      showToast('Failed to load customer data', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading customer details...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="p-8">
        <p>Customer not found</p>
      </div>
    )
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
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
        
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <User className="h-8 w-8 text-slate-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{customer.customerName}</h1>
            <p className="text-slate-500 mt-1">{customer.accountNumber}</p>
          </div>
          {customer.historicalHealth && (
            <Badge 
              variant={
                customer.historicalHealth === 'Excellent' ? 'default' :
                customer.historicalHealth === 'Good' ? 'secondary' :
                customer.historicalHealth === 'Fair' ? 'medium' :
                'destructive'
              }
              className="text-base px-4 py-2"
            >
              {customer.historicalHealth} Health
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-slate-500">Amount Due</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(customer.amountDue || 0)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    <p className="text-sm text-slate-500">Invoice Number</p>
                  </div>
                  <p className="text-lg font-mono text-slate-900">
                    {customer.invoiceNumber || 'N/A'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <p className="text-sm text-slate-500">Due Date</p>
                  </div>
                  <p className="text-base font-medium text-slate-900">
                    {customer.dueDate ? new Date(customer.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-slate-500">Customer Tier</p>
                  </div>
                  <p className="text-base font-semibold text-slate-900">
                    {customer.customerTier || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cases */}
          <Card>
            <CardHeader>
              <CardTitle>Associated Cases ({customerCases.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customerCases.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No cases found for this customer</p>
                ) : (
                  customerCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => navigate(`/case/${caseItem.id}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm text-slate-600">
                            {caseItem.caseId || caseItem.id}
                          </span>
                          <Badge 
                            variant={
                              caseItem.status === 'legal' ? 'destructive' :
                              caseItem.status === 'in_progress' ? 'high' :
                              caseItem.status === 'pending' ? 'warning' :
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {caseItem.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div>
                            <p className="text-xs text-slate-500">Amount</p>
                            <p className="text-sm font-semibold text-slate-900">{formatCurrency(caseItem.invoiceAmount || 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Aging</p>
                            <p className="text-sm font-medium text-slate-900">{caseItem.agingDays || 0} days</p>
                          </div>
                          {caseItem.assignedAgency && (
                            <div>
                              <p className="text-xs text-slate-500">Agency</p>
                              <p className="text-sm font-medium text-slate-900">{caseItem.assignedAgency}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Email</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  {customer.customerEmail || 'N/A'}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Account Type</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  {customer.accountType || 'N/A'}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Region</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  {customer.region || 'N/A'}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Service Type</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  {customer.serviceType || 'N/A'}
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full">
                  View Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
