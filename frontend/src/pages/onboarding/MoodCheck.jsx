import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useAssessmentStore } from '../../store/assessmentStore'
import { MOOD_OPTIONS, ROUTES } from '../../constants'

/**
 * Mood Check page
 */
export const MoodCheck = () => {
  const navigate = useNavigate()
  const { mood, setMood, nextStep } = useAssessmentStore()

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood)
    setTimeout(() => {
      nextStep()
      navigate(ROUTES.ONBOARDING_STRESSORS)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-lg mb-4">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Welcome to Burnout Guard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Let's start by understanding how you're feeling today</p>
          </div>

          {/* Question */}
          <Card className="mb-8 shadow-lg-soft">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How are you feeling today?</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">This helps us personalize your experience</p>
            </div>

            {/* Mood Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOOD_OPTIONS.map((option, index) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleMoodSelect(option.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer
                    ${
                      mood === option.id
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{option.emoji}</div>
                  <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Progress */}
          <div className="flex items-center justify-between">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full" style={{ width: '33.33%' }} />
            </div>
            <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">Step 1 of 3</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
