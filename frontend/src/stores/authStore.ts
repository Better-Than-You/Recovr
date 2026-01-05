import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  role: 'fedex' | 'dca'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (role: 'fedex' | 'dca') => void
  logout: () => void
  switchRole: (role: 'fedex' | 'dca') => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (role: 'fedex' | 'dca') => {
        const user: User = role === 'fedex' 
          ? { id: '1', name: 'John Smith', email: 'john@fedex.com', role: 'fedex' }
          : { id: '2', name: 'Sarah Johnson', email: 'sarah@premier.com', role: 'dca' }
        
        set({ user, isAuthenticated: true })
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      
      switchRole: (role: 'fedex' | 'dca') => {
        const user: User = role === 'fedex' 
          ? { id: '1', name: 'John Smith', email: 'john@fedex.com', role: 'fedex' }
          : { id: '2', name: 'Sarah Johnson', email: 'sarah@premier.com', role: 'dca' }
        
        set({ user })
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
