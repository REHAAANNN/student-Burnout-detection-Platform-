import { useAuthStore } from './authStore'

/**
 * Custom hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  const { token } = useAuthStore()
  return !!token
}

/**
 * Custom hook to get current user
 */
export const useCurrentUser = () => {
  const { user } = useAuthStore()
  return user
}

/**
 * Custom hook to logout
 */
export const useLogout = () => {
  const { logout } = useAuthStore()
  return logout
}
