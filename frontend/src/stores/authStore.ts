import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authService from '@/services/authService'

export interface User {
  id: string
  name: string
  email: string
  role: 'fedex' | 'agency'
  agencyId?: string
  agencyName?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          const response = await authService.login({ email, password })
          set({ 
            user: response.user, 
            token: response.token,
            isAuthenticated: true 
          })
        } catch (error) {
          console.error('Login failed:', error)
          throw error
        }
      },
      
      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ user: null, token: null, isAuthenticated: false })
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
