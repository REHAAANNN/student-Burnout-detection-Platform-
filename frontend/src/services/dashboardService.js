import apiClient from './api'

/**
 * Dashboard service
 */

export const dashboardService = {
  /**
   * Get dashboard data
   */
  getDashboardData: async (userId) => {
    try {
      if (!userId) {
        throw new Error('You must be logged in to view dashboard data')
      }

      const response = await apiClient.get(`/dashboard/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to load dashboard data')
    }
  },

  /**
   * Get burnout trend data
   */
  getBurnoutTrend: async (userId) => {
    try {
      if (!userId) {
        throw new Error('You must be logged in to view trend data')
      }

      const response = await apiClient.get(`/dashboard/trends/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to load trend data')
    }
  },

  /**
   * Get burnout forecast
   */
  getBurnoutForecast: async (userId) => {
    try {
      if (!userId) {
        throw new Error('You must be logged in to view forecast data')
      }

      const response = await apiClient.get(`/dashboard/forecast/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to load forecast data')
    }
  },

  /**
   * Get recommendations
   */
  getRecommendations: async () => {
    throw new Error('Use getDashboardData(userId) to load personalized recommendations')
  }
}
