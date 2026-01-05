import * as React from "react"
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"
import { Modal } from "./modal"
import { Button } from "./button"

type ConfirmationType = 'danger' | 'warning' | 'info' | 'success'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmationType
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  isLoading = false
}: ConfirmationModalProps) {
  const icons = {
    danger: <XCircle className="h-12 w-12 text-red-500" />,
    warning: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
    info: <Info className="h-12 w-12 text-blue-500" />,
    success: <CheckCircle className="h-12 w-12 text-green-500" />
  }

  const buttonVariants = {
    danger: 'destructive' as const,
    warning: 'default' as const,
    info: 'default' as const,
    success: 'default' as const
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div className="flex items-center justify-center">
          {icons[type]}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>

        {/* Message */}
        <p className="text-sm text-slate-600">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 w-full pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[type]}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
