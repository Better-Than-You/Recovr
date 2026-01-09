import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { CaseAllocation } from './pages/CaseAllocation'
import { CaseDetail } from './pages/CaseDetail'
import { AgencyPerformance } from './pages/AgencyPerformance'
import { AuditLogs } from './pages/AuditLogs'
import { MyCases } from './pages/MyCases'
import { PendingActions } from './pages/PendingActions'
import { RecoveryStats } from './pages/RecoveryStats'
import { Agencies } from './pages/Agencies'
import { AgencyDetail } from './pages/AgencyDetail'
import { Customers } from './pages/Customers'
import { CustomerDetail } from './pages/CustomerDetail'
import { Unauthorized } from './pages/Unauthorized'
import { AddUser } from './pages/AddUser'
import { AddAgency } from './pages/AddAgency'
import { Toast } from './components/Toast'

// Route guard component for FedEx-only routes
function FedExRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  
  if (user?.role !== 'fedex') {
    return <Unauthorized />
  }
  
  return <>{children}</>
}

// Route guard component for Agency routes
function AgencyRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  
  // Only agency employees can access these routes
  if (user?.role !== 'agency') {
    return <Unauthorized />
  }
  
  return <>{children}</>
}

function ProtectedRoutes() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const role = user?.role || 'fedex'

  return (
    <Layout>
      <Routes>
        {/* FedEx Admin Routes */}
        <Route 
          path="/" 
          element={
            <FedExRoute>
              <Dashboard />
            </FedExRoute>
          } 
        />
        <Route 
          path="/case-allocation" 
          element={
            <FedExRoute>
              <CaseAllocation />
            </FedExRoute>
          } 
        />
        <Route 
          path="/agencies" 
          element={
            <FedExRoute>
              <Agencies />
            </FedExRoute>
          } 
        />
        <Route 
          path="/add-dca" 
          element={
            <FedExRoute>
              <AddAgency />
            </FedExRoute>
          } 
        />
        <Route 
          path="/agency/:agencyId" 
          element={
            <FedExRoute>
              <AgencyDetail />
            </FedExRoute>
          } 
        />
        <Route 
          path="/add-user" 
          element={
            <FedExRoute>
              <AddUser />
            </FedExRoute>
          } 
        />
        <Route 
          path="/agency-performance" 
          element={
            <FedExRoute>
              <AgencyPerformance />
            </FedExRoute>
          } 
        />
        <Route 
          path="/audit-logs" 
          element={
            <FedExRoute>
              <AuditLogs />
            </FedExRoute>
          } 
        />
        
        {/* Agency Employee Routes */}
        <Route 
          path="/my-cases" 
          element={
            <AgencyRoute>
              <MyCases />
            </AgencyRoute>
          } 
        />
        <Route 
          path="/pending-actions" 
          element={
            <AgencyRoute>
              <PendingActions />
            </AgencyRoute>
          } 
        />
        <Route 
          path="/recovery-stats" 
          element={
            <AgencyRoute>
              <RecoveryStats />
            </AgencyRoute>
          } 
        />
        
        {/* Shared Routes */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/customer/:customerId" element={<CustomerDetail />} />
        <Route path="/case/:caseId" element={<CaseDetail />} />
        
        {/* Default redirect based on role */}
        <Route path="*" element={<Navigate to={role === 'fedex' ? '/' : '/my-cases'} replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
      <Toast />
    </BrowserRouter>
  )
}

export default App
