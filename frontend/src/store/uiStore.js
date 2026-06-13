import { create } from 'zustand'

/**
 * UI store for global UI state
 */
export const useUIStore = create((set) => ({
  isDarkMode: false,
  isSidebarOpen: true,
  isLoading: false,

  // Toggle dark mode
  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.isDarkMode
      if (newMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { isDarkMode: newMode }
    }),

  // Toggle sidebar
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading })
}))
