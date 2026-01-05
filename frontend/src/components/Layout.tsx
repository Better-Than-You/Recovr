import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

type Role = 'fedex' | 'dca'

interface LayoutProps {
  currentRole: Role
  onRoleChange: (role: Role) => void
}

export function Layout({ currentRole, onRoleChange }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentRole={currentRole} onRoleChange={onRoleChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar currentRole={currentRole} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
