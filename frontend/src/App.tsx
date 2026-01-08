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
import { AddUser } from './pages/AddUser'
import { AddAgency } from './pages/AddAgency'
import { Toast } from './components/Toast'

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
        <Route path="/" element={role === 'fedex' ? <Dashboard /> : <Navigate to="/my-cases" />} />
        <Route path="/case-allocation" element={<CaseAllocation />} />
        <Route path="/agencies" element={<Agencies />} />
        <Route path="/add-dca" element={<AddAgency />} />
        <Route path="/agency/:agencyId" element={<AgencyDetail />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/agency-performance" element={<AgencyPerformance />} />
        <Route path="/audit-logs" element={<AuditLogs />} />

        {/* DCA Agent Routes */}
        <Route path="/my-cases" element={<MyCases />} />
        <Route path="/pending-actions" element={<PendingActions />} />
        <Route path="/recovery-stats" element={<RecoveryStats />} />

        {/* Shared Routes */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/customer/:customerId" element={<CustomerDetail />} />
        <Route path="/case/:caseId" element={<CaseDetail />} />
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
