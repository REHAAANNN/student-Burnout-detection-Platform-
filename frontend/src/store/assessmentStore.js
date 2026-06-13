import { create } from 'zustand'

/**
 * Assessment store for the advanced 6-section burnout assessment
 */
export const useAssessmentStore = create((set) => ({
  // Section 1 - Mood Snapshot
  mood: null,
  energyLevel: null,
  overwhelmedLevel: null,
  mentalExhaustion: null,

  // Section 2 - Stressors
  stressors: [],

  // Section 3 - Core Burnout
  coreAnswers: {},

  // Section 4 - Dynamic Stressor-Specific
  stressorAnswers: {},

  // Section 5 - Lifestyle
  lifestyleAnswers: {},

  // Section 6 - Vent Journal
  ventJournal: '',

  // Assessment state
  currentSection: 0,
  currentQuestionIndex: 0,
  completed: false,
  savedAt: null,

  // Section 1 - Mood
  setMood: (mood) => set({ mood }),
  setEnergyLevel: (value) => set({ energyLevel: value }),
  setOverwhelmedLevel: (value) => set({ overwhelmedLevel: value }),
  setMentalExhaustion: (value) => set({ mentalExhaustion: value }),

  // Section 2 - Stressors
  setStressors: (stressors) => set({ stressors }),
  toggleStressor: (id) =>
    set((state) => ({
      stressors: state.stressors.includes(id)
        ? state.stressors.filter((s) => s !== id)
        : [...state.stressors, id]
    })),

  // Section 3 - Core
  setCoreAnswer: (id, value) =>
    set((state) => ({
      coreAnswers: { ...state.coreAnswers, [id]: value }
    })),
  setCoreAnswers: (answers) => set({ coreAnswers: answers }),

  // Section 4 - Stressor-specific
  setStressorAnswer: (id, value) =>
    set((state) => ({
      stressorAnswers: { ...state.stressorAnswers, [id]: value }
    })),
  setStressorAnswers: (answers) => set({ stressorAnswers: answers }),

  // Section 5 - Lifestyle
  setLifestyleAnswer: (id, value) =>
    set((state) => ({
      lifestyleAnswers: { ...state.lifestyleAnswers, [id]: value }
    })),
  setLifestyleAnswers: (answers) => set({ lifestyleAnswers: answers }),

  // Section 6 - Vent
  setVentJournal: (value) => set({ ventJournal: value }),

  // Navigation
  setCurrentSection: (section) => set({ currentSection: section }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  nextQuestion: () =>
    set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
    })),
  goToSection: (section) =>
    set({ currentSection: section, currentQuestionIndex: 0 }),
  nextSection: () =>
    set((state) => ({
      currentSection: state.currentSection + 1,
      currentQuestionIndex: 0
    })),
  prevSection: () =>
    set((state) => ({
      currentSection: Math.max(0, state.currentSection - 1),
      currentQuestionIndex: 0
    })),

  // Save progress timestamp
  setSavedAt: (time) => set({ savedAt: time }),

  // Mark as complete
  setCompleted: (completed) => set({ completed }),

  // Get all answers for submission
  getAllAnswers: () => {
    const state = useAssessmentStore.getState()
    return {
      mood: {
        mood: state.mood,
        energyLevel: state.energyLevel,
        overwhelmedLevel: state.overwhelmedLevel,
        mentalExhaustion: state.mentalExhaustion
      },
      stressors: state.stressors,
      core: state.coreAnswers,
      stressorSpecific: state.stressorAnswers,
      lifestyle: state.lifestyleAnswers,
      ventJournal: state.ventJournal
    }
  },

  // Reset everything
  reset: () =>
    set({
      mood: null,
      energyLevel: null,
      overwhelmedLevel: null,
      mentalExhaustion: null,
      stressors: [],
      coreAnswers: {},
      stressorAnswers: {},
      lifestyleAnswers: {},
      ventJournal: '',
      currentSection: 0,
      currentQuestionIndex: 0,
      completed: false,
      savedAt: null
    })
}))