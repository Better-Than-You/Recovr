import { useUIStore } from '@/stores'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Toast() {
  const toast = useUIStore(state => state.toast)
  const hideToast = useUIStore(state => state.hideToast)

  if (!toast?.isVisible) return null

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }

  const Icon = icons[toast.type]

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-lg border-2 shadow-lg min-w-[300px] max-w-md",
        styles[toast.type]
      )}>
        <Icon className="h-5 w-5 shrink-0" />
        <p className="flex-1 text-sm font-medium">{toast.message}</p>
        <button
          onClick={hideToast}
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
