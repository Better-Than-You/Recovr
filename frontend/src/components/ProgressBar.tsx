import { X, Loader2, CheckCircle2, Upload, Radio, Cog, UserCheck } from 'lucide-react'
import { useUIStore, ProgressStatus } from '@/stores/uiStore'
import { useEffect } from 'react'

export function ProgressBar() {
  const { 
    progressBar, 
    setProgressMinimized, 
    resetProgress 
  } = useUIStore()
  
  const { status, currentAssigned, totalRows, isMinimized } = progressBar

  // Auto-reset when done after 3 seconds
  useEffect(() => {
    if (status === 'done') {
      const timeout = setTimeout(() => {
        resetProgress()
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [status, resetProgress])

  // Don't render if disabled
  if (status === 'disabled') {
    return null
  }

  // Minimized state - show as a small button
  if (isMinimized) {
    return (
      <button
        onClick={() => setProgressMinimized(false)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all z-50 animate-pulse"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">
          {status === 'assigning' && `Processing ${currentAssigned}/${totalRows}`}
          {status === 'uploading' && 'Uploading...'}
          {status === 'received' && 'Received'}
          {status === 'processing' && 'Processing...'}
        </span>
      </button>
    )
  }

  const steps: Array<{
    key: ProgressStatus
    label: string
    icon: React.ReactNode
  }> = [
    { key: 'uploading', label: 'Uploading CSV', icon: <Upload className="w-4 h-4" /> },
    { key: 'received', label: 'Received', icon: <Radio className="w-4 h-4" /> },
    { key: 'processing', label: 'Processing', icon: <Cog className="w-4 h-4" /> },
    { key: 'assigning', label: 'Assigning', icon: <UserCheck className="w-4 h-4" /> },
    { key: 'done', label: 'Done', icon: <CheckCircle2 className="w-4 h-4" /> },
  ]

  const currentStepIndex = steps.findIndex(step => step.key === status)
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Loader2 className={`w-5 h-5 text-blue-600 ${status !== 'done' ? 'animate-spin' : 'hidden'}`} />
            <CheckCircle2 className={`w-5 h-5 text-green-600 ${status === 'done' ? 'block' : 'hidden'}`} />
            <h3 className="text-sm font-semibold text-gray-900">
              CSV Upload Progress
            </h3>
          </div>
          <button
            onClick={() => setProgressMinimized(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Minimize"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                status === 'done' ? 'bg-green-500' : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="flex justify-between items-start">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex
            const isCompleted = index < currentStepIndex
            const isPending = index > currentStepIndex

            return (
              <div
                key={step.key}
                className="flex flex-col items-center flex-1"
              >
                {/* Icon Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isCompleted
                      ? 'bg-green-100 text-green-600'
                      : isActive
                      ? 'bg-blue-100 text-blue-600 animate-pulse'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium text-center ${
                    isCompleted
                      ? 'text-green-600'
                      : isActive
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                  {step.key === 'assigning' && status === 'assigning' && (
                    <div className="text-xs mt-1 font-semibold">
                      {currentAssigned}/{totalRows}
                    </div>
                  )}
                </span>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute h-0.5 transition-all duration-500 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{
                      width: `calc(100% / ${steps.length})`,
                      left: `${((index + 0.5) / steps.length) * 100}%`,
                      top: '20px',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
