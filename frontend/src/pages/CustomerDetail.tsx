import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { customers, mockCases } from '@/data/mockData'
import { ArrowLeft, User, DollarSign, Briefcase, Mail, Phone, MapPin, Calendar, ChevronRight, Building2 } from 'lucide-react'

export function CustomerDetail() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  
  const customer = customers.find(c => c.id === customerId)
  const customerCases = mockCases.filter(c => c.customerName === customer?.name)

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

  const getPaymentHistoryBadge = (history: string) => {
    const map = {
      excellent: { variant: 'default' as const, label: 'Excellent' },
      good: { variant: 'secondary' as const, label: 'Good' },
      fair: { variant: 'medium' as const, label: 'Fair' },
      poor: { variant: 'destructive' as const, label: 'Poor' }
    }
    return map[history as keyof typeof map]
  }

  const historyBadge = getPaymentHistoryBadge(customer.paymentHistory)

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
            <h1 className="text-3xl font-bold text-slate-900">{customer.name}</h1>
            <p className="text-slate-500 mt-1">{customer.id}</p>
          </div>
          <Badge 
            variant={historyBadge.variant}
            className="text-base px-4 py-2"
          >
            {historyBadge.label} Payment History
          </Badge>
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
                    <p className="text-sm text-slate-500">Total Outstanding</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(customer.totalOwed)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    <p className="text-sm text-slate-500">Active Cases</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {customer.activeCases}
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
                      key={caseItem.caseId}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => navigate(`/case/${caseItem.caseId}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm text-slate-600">
                            {caseItem.caseId}
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
                            <p className="text-sm font-semibold text-slate-900">{formatCurrency(caseItem.amount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Aging</p>
                            <p className="text-sm font-medium text-slate-900">{caseItem.agingDays} days</p>
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
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Email</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  {customer.email}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Phone</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  {customer.phone}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Address</p>
                </div>
                <div className="text-sm font-medium text-slate-900 pl-6">
                  <p>{customer.address}</p>
                  <p>{customer.city}, {customer.state} {customer.zip}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Last Contact</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  {new Date(customer.lastContact).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
