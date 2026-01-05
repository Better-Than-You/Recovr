import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Briefcase } from 'lucide-react'

export function Login() {
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)

  const handleLogin = (role: 'fedex' | 'dca') => {
    login(role)
    navigate(role === 'fedex' ? '/' : '/my-cases')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Debt Collection Management System
          </h1>
          <p className="text-slate-600">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FedEx Admin */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleLogin('fedex')}>
            <CardHeader>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-center text-2xl">FedEx Admin</CardTitle>
              <CardDescription className="text-center">
                Manage cases, agencies, and monitor performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Login as FedEx Admin
              </Button>
              <div className="mt-4 p-3 bg-slate-50 rounded text-sm">
                <p className="text-slate-600">
                  <span className="font-medium">Access:</span> Dashboard, Case Allocation, Agency Management
                </p>
              </div>
            </CardContent>
          </Card>

          {/* DCA Agent */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleLogin('dca')}>
            <CardHeader>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-center text-2xl">DCA Agent</CardTitle>
              <CardDescription className="text-center">
                Work on assigned cases and track recovery progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" size="lg">
                Login as DCA Agent
              </Button>
              <div className="mt-4 p-3 bg-slate-50 rounded text-sm">
                <p className="text-slate-600">
                  <span className="font-medium">Access:</span> My Cases, Pending Actions, Recovery Stats
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Demo Mode - Click any card to login instantly
        </p>
      </div>
    </div>
  )
}
