import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

type Role = 'fedex' | 'dca'

interface LayoutProps {
  currentRole: Role
  onRoleChange: (role: Role) => void
}

export function Layout({ currentRole, onRoleChange }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentRole={currentRole} onRoleChange={onRoleChange} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
