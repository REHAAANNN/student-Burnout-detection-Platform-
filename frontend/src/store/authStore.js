import { create } from 'zustand'
import { authService } from '../services/authService'
import { tokenStorage } from '../utils/tokenStorage'

/**
 * Authentication store using Zustand
 */
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Initialize auth from the stored session
  initAuth: () => {
    const token = tokenStorage.getToken()
    const userData = tokenStorage.getUser()
    
    if (token && userData) {
      set({
        token,
        user: userData
      })
    }
  },

  // Register action - sends OTP to email
  register: async (name, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authService.register(name, email, password)
      set({ isLoading: false })
      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Verify register OTP
  verifyRegisterOtp: async (email, otp) => {
    set({ isLoading: true, error: null })
    try {
      const { token, user } = await authService.verifyRegisterOtp(email, otp)
      set({ user, token, isLoading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Login action - sends OTP to email
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authService.login(email, password)
      set({ isLoading: false })
      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Verify login OTP
  verifyLoginOtp: async (email, otp) => {
    set({ isLoading: true, error: null })
    try {
      const { token, user } = await authService.verifyLoginOtp(email, otp)
      set({ user, token, isLoading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true })
    try {
      await authService.logout()
      set({ user: null, token: null, isLoading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}))