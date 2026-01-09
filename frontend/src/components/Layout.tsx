import { Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function Layout({ children }: { children?: React.ReactNode }) {
  const { user } = useAuthStore()
  const currentRole = user?.role || 'fedex'

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentRole={currentRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar currentRole={currentRole} />
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}
