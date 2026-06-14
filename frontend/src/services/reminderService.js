import apiClient from './api'

export const reminderService = {
  getReminders: async (userId) => {
    if (!userId) throw new Error('You must be logged in to view reminders')
    const response = await apiClient.get(`/reminders/${userId}`)
    return response.data.data
  },

  updateReminder: async (userId, type, updates) => {
    if (!userId) throw new Error('You must be logged in to update reminders')
    const response = await apiClient.put(`/reminders/${userId}/${type}`, updates)
    return response.data.data
  },

  trackReminder: async (userId, type, amount = 1) => {
    if (!userId) throw new Error('You must be logged in to track wellness progress')
    const response = await apiClient.post(`/reminders/${userId}/${type}/track`, { amount })
    return response.data.data
  }
}
