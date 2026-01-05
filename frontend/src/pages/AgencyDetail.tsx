import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { agencies, mockCases } from '@/data/mockData'
import { ArrowLeft, Building2, DollarSign, Briefcase, TrendingUp, Mail, Phone, MapPin, ChevronRight } from 'lucide-react'

export function AgencyDetail() {
  const { agencyId } = useParams()
  const navigate = useNavigate()
  
  const agency = agencies.find(a => a.id === agencyId)
  const agencyCases = mockCases.filter(c => c.assignedAgency === agency?.name)

  if (!agency) {
    return (
      <div className="p-8">
        <p>Agency not found</p>
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
          Back to Agencies
        </Button>
        
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{agency.name}</h1>
            <p className="text-slate-500 mt-1">Collection Agency Partner</p>
          </div>
          <Badge 
            variant={
              agency.performanceScore >= 0.9 ? 'default' :
              agency.performanceScore >= 0.8 ? 'secondary' :
              'outline'
            }
            className="text-base px-4 py-2"
          >
            {(agency.performanceScore * 100).toFixed(0)}% Performance
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-slate-500">Total Recovered</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(agency.totalRecovered)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    <p className="text-sm text-slate-500">Active Cases</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {agency.activeCases}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm text-slate-500">Success Rate</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {(agency.performanceScore * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Cases */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Cases ({agencyCases.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agencyCases.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No cases assigned to this agency</p>
                ) : (
                  agencyCases.map((caseItem) => (
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
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {caseItem.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="font-medium text-slate-900">{caseItem.customerName}</p>
                        <p className="text-sm text-slate-600">{formatCurrency(caseItem.amount)}</p>
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
              <CardTitle>Agency Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Agency ID</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6 font-mono">
                  {agency.id.toUpperCase()}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Contact Email</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  contact@{agency.id}.com
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Phone</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  +1 (555) 123-4567
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Location</p>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-6">
                  New York, NY
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Partner Since</p>
                <p className="text-sm font-medium text-slate-900">January 2023</p>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Agency
                </Button>
                <Button variant="outline" className="w-full">
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
