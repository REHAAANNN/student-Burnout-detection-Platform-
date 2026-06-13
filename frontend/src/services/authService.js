import apiClient from './api'
import { tokenStorage } from '../utils/tokenStorage'

/**
 * Authentication service
 */
export const authService = {
  /**
   * Register user - sends OTP to email
   */
  register: async (name, email, password) => {
    try {
      if (!name || !email || !password) {
        throw new Error('All fields are required')
      }

      const response = await apiClient.post('/auth/register', { name, email, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
  },

  /**
   * Verify register OTP
   */
  verifyRegisterOtp: async (email, otp) => {
    try {
      if (!email || !otp) {
        throw new Error('Email and OTP are required')
      }

      const response = await apiClient.post('/auth/verify-register-otp', { email, otp })
      const { token, user } = response.data.data

      // Save token and user data
      const userData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified
      }

      tokenStorage.setToken(token)
      tokenStorage.setUser(userData)

      return {
        token,
        user: userData
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'OTP verification failed')
    }
  },

  /**
   * Login user - sends OTP to email
   */
  login: async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const response = await apiClient.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
  },

  /**
   * Verify login OTP
   */
  verifyLoginOtp: async (email, otp) => {
    try {
      if (!email || !otp) {
        throw new Error('Email and OTP are required')
      }

      const response = await apiClient.post('/auth/verify-login-otp', { email, otp })
      const { token, user } = response.data.data

      // Save token and user data
      const userData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified
      }

      tokenStorage.setToken(token)
      tokenStorage.setUser(userData)

      return {
        token,
        user: userData
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'OTP verification failed')
    }
  },

  /**
   * Get current user profile from API
   */
  getProfile: async () => {
    try {
      const token = tokenStorage.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await apiClient.get('/auth/profile')
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to get profile')
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      tokenStorage.clear()
      return { success: true }
    } catch (error) {
      throw error
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!tokenStorage.getToken()
  }
}