import apiClient from './api'

/**
 * Journal service
 */

export const journalService = {
  /**
   * Save journal entry
   */
  saveEntry: async (content, userId) => {
    try {
      if (!userId) throw new Error('You must be logged in to save journal entries')

      const response = await apiClient.post('/journal', { userId, entry: content })
      return normalizeEntry(response.data.data)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to save entry')
    }
  },

  /**
   * Get all journal entries
   */
  getEntries: async (userId) => {
    try {
      if (!userId) throw new Error('You must be logged in to view journal entries')

      const response = await apiClient.get(`/journal/${userId}`)
      return (response.data.data || []).map(normalizeEntry)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to load entries')
    }
  },

  /**
   * Delete journal entry
   */
  deleteEntry: async (id) => {
    try {
      await apiClient.delete(`/journal/${id}`)
      return { success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete entry')
    }
  }
}

const normalizeEntry = (entry) => ({
  id: entry._id,
  content: entry.entry,
  date: entry.createdAt,
  mood: entry.sentiment
})
