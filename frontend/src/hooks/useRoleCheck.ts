import { useAuthStore } from '@/stores'

type Role = 'fedex' | 'agency'

/**
 * Custom hook for checking user roles and permissions
 * 
 * @example
 * const { isFedEx, isDCA, hasRole, currentRole } = useRoleCheck()
 * 
 * if (isFedEx) {
 *   // FedEx-specific logic
 * }
 * 
 * if (hasRole(['fedex', 'dca'])) {
 *   // Logic for multiple roles
 * }
 */
export function useRoleCheck() {
  const { user } = useAuthStore()

  const currentRole = user?.role

  const isFedEx = currentRole === 'fedex'
  const isAgency = currentRole === 'agency'

  /**
   * Check if user has one of the specified roles
   * @param roles - Single role or array of roles to check
   * @returns true if user has any of the specified roles
   */
  const hasRole = (roles: Role | Role[]): boolean => {
    if (!currentRole) return false
    const rolesArray = Array.isArray(roles) ? roles : [roles]
    return rolesArray.includes(currentRole)
  }

  /**
   * Check if user has all of the specified roles
   * @param roles - Array of roles that user must have
   * @returns true if user has all specified roles
   */
  const hasAllRoles = (roles: Role[]): boolean => {
    if (!currentRole) return false
    return roles.every(role => role === currentRole)
  }

  return {
    currentRole,
    isFedEx,
    isAgency,
    hasRole,
    hasAllRoles,
    user
  }
}
