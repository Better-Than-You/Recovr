import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { CaseAllocation } from './pages/CaseAllocation'
import { CaseDetail } from './pages/CaseDetail'
import { AgencyPerformance } from './pages/AgencyPerformance'
import { AuditLogs } from './pages/AuditLogs'
import { MyCases } from './pages/MyCases'
import { PendingActions } from './pages/PendingActions'
import { RecoveryStats } from './pages/RecoveryStats'

type Role = 'fedex' | 'dca'

function App() {
  const [currentRole, setCurrentRole] = useState<Role>('fedex')

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout currentRole={currentRole} onRoleChange={setCurrentRole} />}>
          {/* FedEx Admin Routes */}
          <Route path="/" element={currentRole === 'fedex' ? <Dashboard /> : <Navigate to="/my-cases" />} />
          <Route path="/case-allocation" element={<CaseAllocation />} />
          <Route path="/agency-performance" element={<AgencyPerformance />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          
          {/* DCA Agent Routes */}
          <Route path="/my-cases" element={<MyCases />} />
          <Route path="/pending-actions" element={<PendingActions />} />
          <Route path="/recovery-stats" element={<RecoveryStats />} />
          
          {/* Shared Routes */}
          <Route path="/case/:caseId" element={<CaseDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
