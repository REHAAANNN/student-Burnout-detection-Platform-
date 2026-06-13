import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { MultiSelect } from '../../components/ui/Select'
import { useAssessmentStore } from '../../store/assessmentStore'
import { STRESSOR_OPTIONS, ROUTES } from '../../constants'

/**
 * Stress Selection page
 */
export const StressSelection = () => {
  const navigate = useNavigate()
  const { stressors, setStressors, nextStep } = useAssessmentStore()

  const stressorOptions = STRESSOR_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.id
  }))

  const handleContinue = () => {
    if (stressors.length === 0) {
      alert('Please select at least one stressor')
      return
    }
    nextStep()
    navigate(ROUTES.ONBOARDING_ASSESSMENT)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Back Button */}
          <button
            onClick={() => navigate(ROUTES.ONBOARDING_MOOD)}
            className="text-primary-600 hover:text-primary-700 font-medium mb-6 text-sm"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">What's causing your stress?</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Select all that apply</p>
          </div>

          {/* Form */}
          <Card className="mb-8 shadow-lg-soft">
            <MultiSelect
              label="Stressors"
              options={stressorOptions}
              value={stressors}
              onChange={setStressors}
            />

            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(ROUTES.ONBOARDING_MOOD)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </Card>

          {/* Progress */}
          <div className="flex items-center justify-between">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full" style={{ width: '66.67%' }} />
            </div>
            <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">Step 2 of 3</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
