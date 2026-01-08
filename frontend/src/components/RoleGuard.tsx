import type { ReactNode } from 'react'
import { useAuthStore } from '@/stores'

type Role = 'fedex' | 'agency'

interface RoleGuardProps {
  /**
   * Roles that are allowed to see this content
   */
  allowedRoles: Role | Role[]
  /**
   * Content to render if user has permission
   */
  children: ReactNode
  /**
   * Optional fallback content to render if user doesn't have permission
   * If not provided, nothing will be rendered
   */
  fallback?: ReactNode
  /**
   * If true, renders fallback instead of null when unauthorized
   * Default: false
   */
  showFallback?: boolean
}

/**
 * RoleGuard component - Conditionally render content based on user role
 * 
 * @example
 * // Show content only to FedEx admins
 * <RoleGuard allowedRoles="fedex">
 *   <AdminPanel />
 * </RoleGuard>
 * 
 * @example
 * // Show content to multiple roles
 * <RoleGuard allowedRoles={['fedex', 'dca']}>
 *   <SharedContent />
 * </RoleGuard>
 * 
 * @example
 * // Show fallback content for unauthorized users
 * <RoleGuard allowedRoles="fedex" showFallback fallback={<p>Admin only</p>}>
 *   <AdminPanel />
 * </RoleGuard>
 */
export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = null,
  showFallback = false 
}: RoleGuardProps) {
  const { user } = useAuthStore()

  // Normalize allowedRoles to array
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  // Check if user has permission
  const hasPermission = user && rolesArray.includes(user.role)

  if (hasPermission) {
    return <>{children}</>
  }

  return showFallback ? <>{fallback}</> : null
}

/**
 * Shorthand components for common role checks
 */
export function FedExOnly({ children, fallback, showFallback }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard allowedRoles="fedex" fallback={fallback} showFallback={showFallback}>
      {children}
    </RoleGuard>
  )
}

export function AgencyOnly({ children, fallback, showFallback }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard allowedRoles="agency" fallback={fallback} showFallback={showFallback}>
      {children}
    </RoleGuard>
  )
}
