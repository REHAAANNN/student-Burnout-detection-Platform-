/**
 * Utility functions
 */

/**
 * Determine risk level based on burnout score
 */
export const getRiskLevel = (score) => {
  if (score < 40) return 'Low Risk'
  if (score < 70) return 'Moderate Risk'
  return 'High Risk'
}

/**
 * Get color for risk level
 */
export const getRiskColor = (riskLevel) => {
  const colors = {
    'Low Risk': 'success',
    'Moderate Risk': 'warning',
    'High Risk': 'danger'
  }
  return colors[riskLevel] || 'primary'
}

/**
 * Get color CSS class for risk level
 */
export const getRiskColorClass = (riskLevel) => {
  const classes = {
    'Low Risk': 'bg-success-50 text-success-700 border-success-200',
    'Moderate Risk': 'bg-warning-50 text-warning-700 border-warning-200',
    'High Risk': 'bg-danger-50 text-danger-700 border-danger-200'
  }
  return classes[riskLevel] || 'bg-primary-50 text-primary-700 border-primary-200'
}

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format time to readable string
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    feedback: {
      length: password.length >= minLength,
      upperCase: hasUpperCase,
      lowerCase: hasLowerCase,
      numbers: hasNumbers
    }
  }
}

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

/**
 * Sleep utility for async operations
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Throttle function
 */
export const throttle = (fn, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert camelCase to title case
 */
export const camelToTitleCase = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Safe JSON parse
 */
export const safeJsonParse = (json, fallback = null) => {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}
