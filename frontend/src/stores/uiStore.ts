import { create } from 'zustand'

interface Toast {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  isVisible: boolean
}

interface UIState {
  sidebarCollapsed: boolean
  toast: Toast | null
  
  setSidebarCollapsed: (collapsed: boolean) => void
  showToast: (message: string, type: Toast['type'], duration?: number) => void
  hideToast: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  toast: null,
  
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
  }
}))
