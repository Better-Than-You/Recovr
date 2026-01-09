import { create } from 'zustand'

interface Toast {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  isVisible: boolean
}

export type ProgressStatus = 'uploading' | 'received' | 'processing' | 'assigning' | 'done' | 'disabled'

interface ProgressBarState {
  status: ProgressStatus
  currentAssigned: number
  totalRows: number
  isMinimized: boolean
}

interface UIState {
  sidebarCollapsed: boolean
  toast: Toast | null
  progressBar: ProgressBarState
  
  setSidebarCollapsed: (collapsed: boolean) => void
  showToast: (message: string, type: Toast['type'], duration?: number) => void
  hideToast: () => void
  setProgressStatus: (status: ProgressStatus) => void
  setProgressData: (currentAssigned: number, totalRows: number) => void
  setProgressMinimized: (isMinimized: boolean) => void
  resetProgress: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  toast: null,
  progressBar: {
    status: 'disabled',
    currentAssigned: 0,
    totalRows: 0,
    isMinimized: false
  },
  
  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed })
  },
  
  showToast: (message: string, type: Toast['type'], duration = 3000) => {
    set({ toast: { message, type, isVisible: true } })
    
    setTimeout(() => {
      get().hideToast()
    }, duration)
  },
  
  hideToast: () => {
    set({ toast: null })
  },
  
  setProgressStatus: (status: ProgressStatus) => {
    set((state) => ({
      progressBar: { ...state.progressBar, status }
    }))
  },
  
  setProgressData: (currentAssigned: number, totalRows: number) => {
    set((state) => ({
      progressBar: { ...state.progressBar, currentAssigned, totalRows }
    }))
  },
  
  setProgressMinimized: (isMinimized: boolean) => {
    set((state) => ({
      progressBar: { ...state.progressBar, isMinimized }
    }))
  },
  
  resetProgress: () => {
    set({
      progressBar: {
        status: 'disabled',
        currentAssigned: 0,
        totalRows: 0,
        isMinimized: false
      }
    })
  }
}))
