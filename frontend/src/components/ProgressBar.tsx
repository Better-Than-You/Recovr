import { X, Loader2, CheckCircle2, Upload, Radio, Cog, UserCheck, ChevronDown } from 'lucide-react'
import { useUIStore, type ProgressStatus } from '@/stores'
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
        className="fixed bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 transition-all z-50 hover:scale-105"
      >
        <Loader2 className={`w-4 h-4 ${status !== 'done' ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium">
          {status === 'assigning' && `Processing ${currentAssigned}/${totalRows}`}
          {status === 'uploading' && 'Uploading...'}
          {status === 'received' && 'Received'}
          {status === 'processing' && 'Processing...'}
          {status === 'done' && 'Complete!'}
        </span>
        <ChevronDown className="w-4 h-4" />
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
    <div className="fixed bottom-4 left-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {status !== 'done' ? (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            )}
            <h3 className="text-sm font-semibold text-gray-900">
              CSV Upload Progress
            </h3>
          </div>
          <button
            onClick={() => setProgressMinimized(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
            aria-label="Minimize"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                status === 'done' ? 'bg-green-500' : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex
            const isCompleted = index < currentStepIndex

            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 transition-all ${
                  isActive || isCompleted ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-green-100 text-green-600'
                      : isActive
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Label and Progress */}
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${
                      isCompleted
                        ? 'text-green-600'
                        : isActive
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </div>
                  {step.key === 'assigning' && status === 'assigning' && (
                    <div className="text-xs text-gray-500 mt-1">
                      {currentAssigned} of {totalRows} cases assigned
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                {isActive && status !== 'done' && (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                )}
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
