import apiClient from './api'

export const streakService = {
  getStreaks: async (userId) => {
    if (!userId) throw new Error('You must be logged in to view streaks')
    const response = await apiClient.get(`/streaks/${userId}`)
    return response.data
  },

  updateStreaks: async (userId, activity = 'wellness') => {
    if (!userId) throw new Error('You must be logged in to update streaks')
    const response = await apiClient.post('/streaks/update', { userId, activity })
    return response.data.data
  }
}
