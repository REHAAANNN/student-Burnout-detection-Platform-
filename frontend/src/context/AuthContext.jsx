import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { tokenStorage } from '../utils/tokenStorage'
import { useAuthStore } from '../store/authStore'

/**
 * Auth Context for managing authentication state
 */
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth from stored data
  useEffect(() => {
    const storedToken = tokenStorage.getToken()
    const storedUser = tokenStorage.getUser()

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
    }

    setIsLoading(false)
  }, [])

  // Register - sends OTP to email
  const register = useCallback(async (name, email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authService.register(name, email, password)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Verify register OTP
  const verifyRegisterOtp = useCallback(async (email, otp) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authService.verifyRegisterOtp(email, otp)
      setToken(data.token)
      setUser(data.user)
      useAuthStore.getState().initAuth()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login - sends OTP to email
  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authService.login(email, password)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Verify login OTP
  const verifyLoginOtp = useCallback(async (email, otp) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authService.verifyLoginOtp(email, otp)
      setToken(data.token)
      setUser(data.user)
      useAuthStore.getState().initAuth()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get profile
  const getProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await authService.getProfile()
      setUser(userData)
      tokenStorage.setUser(userData)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setToken(null)
      setUser(null)
      setError(null)
      useAuthStore.setState({ user: null, token: null, error: null, isLoading: false })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token && !!user,
    register,
    verifyRegisterOtp,
    login,
    verifyLoginOtp,
    getProfile,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
