const TOKEN_KEY = 'burnout_guard_auth_token'
const USER_KEY = 'burnout_guard_user_data'

/**
 * Token storage utility
 */
export const tokenStorage = {
  getToken: () => {
    try {
      return sessionStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  setToken: (token) => {
    try {
      sessionStorage.setItem(TOKEN_KEY, token)
    } catch (error) {
      console.error('Failed to save token:', error)
    }
  },

  removeToken: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
    } catch (error) {
      console.error('Failed to remove token:', error)
    }
  },

  getUser: () => {
    try {
      const data = sessionStorage.getItem(USER_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  setUser: (user) => {
    try {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  },

  removeUser: () => {
    try {
      sessionStorage.removeItem(USER_KEY)
    } catch (error) {
      console.error('Failed to remove user:', error)
    }
  },

  clear: () => {
    tokenStorage.removeToken()
    tokenStorage.removeUser()
  }
}