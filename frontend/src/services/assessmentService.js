import apiClient from './api'
import { buildAssessmentPayload } from '../utils/assessmentPayload'

/**
 * Assessment service
 */

export const assessmentService = {
  /**
   * Submit mood selection
   */
  submitMood: async (mood) => {
    return { success: true, data: mood }
  },

  /**
   * Submit stressor selection
   */
  submitStressors: async (stressors) => {
    return { success: true, data: stressors }
  },

  /**
   * Submit assessment answers
   */
  submitAssessment: async (answers, userId) => {
    try {
      if (!userId) {
        throw new Error('You must be logged in to submit an assessment')
      }

      const payload = buildAssessmentPayload(answers)
      const response = await apiClient.post('/assessment', {
        userId,
        ...payload
      })

      localStorage.setItem('burnout_guard_onboarding_completed', 'true')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to submit assessment')
    }
  },

  /**
   * Get assessment data
   */
  getAssessmentData: async (userId) => {
    if (!userId) {
      throw new Error('You must be logged in to view assessment data')
    }

    const response = await apiClient.get(`/assessment/${userId}`)
    return response.data.data
  }
}
