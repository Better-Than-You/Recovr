import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert } from 'lucide-react'

export function Unauthorized() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleGoBack = () => {
    // Redirect to appropriate home page based on role
    if (user?.role === 'fedex') {
      navigate('/')
    } else {
      navigate('/my-cases')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-900">Access Denied</CardTitle>
            <CardDescription className="text-red-700">
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <span className="font-medium">Current Role:</span>{' '}
                {user?.role === 'fedex' ? 'FedEx Admin' : 'Agency Employee'}
              </p>
              <p className="text-xs text-red-600 mt-2">
                This page is restricted to {user?.role === 'fedex' ? 'Agency users' : 'FedEx Admins'} only.
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleGoBack} 
                className="flex-1"
              >
                Go to Home
              </Button>
              <Button 
                onClick={() => navigate(-1)} 
                variant="outline"
                className="flex-1"
              >
                Go Back
              </Button>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-slate-600 text-center">
                If you believe this is an error, please contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
