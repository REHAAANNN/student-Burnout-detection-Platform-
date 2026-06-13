import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutDashboard, Save } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useAssessmentStore } from '../../store/assessmentStore'
import { ROUTES, STRESSOR_OPTIONS } from '../../constants'
import { questionBank } from '../../constants/questionBank'

const getFieldName = (question) => `${question.stressorId}_${question.id}`

const formatValue = (value) => {
  if (Array.isArray(value)) return value.join(', ')
  return value || 'Not answered'
}

const stepVariants = {
  enter: { opacity: 0, x: 28 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 }
}

/**
 * Adaptive Assessment page
 */
export const AdaptiveAssessment = () => {
  const navigate = useNavigate()
  const { stressors, answers, setAnswers: setStoreAnswers, prevStep } = useAssessmentStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSummary, setIsSummary] = useState(false)
  const [savedAt, setSavedAt] = useState(null)

  const stressorLabels = useMemo(
    () =>
      STRESSOR_OPTIONS.reduce((labels, stressor) => {
        labels[stressor.id] = stressor.label
        return labels
      }, {}),
    []
  )

  const questions = useMemo(
    () =>
      stressors.flatMap((stressorId) =>
        (questionBank[stressorId] || []).map((question) => ({
          ...question,
          stressorId,
          stressorLabel: stressorLabels[stressorId] || stressorId
        }))
      ),
    [stressors, stressorLabels]
  )

  const defaultValues = useMemo(
    () =>
      answers.reduce((values, answer) => {
        values[answer.fieldName] = answer.answer
        return values
      }, {}),
    [answers]
  )

  const {
    control,
    formState: { errors },
    getValues,
    register,
    trigger,
    watch
  } = useForm({
    defaultValues,
    mode: 'onChange'
  })

  const currentQuestion = questions[currentStep]
  const currentFieldName = currentQuestion ? getFieldName(currentQuestion) : null
  const progress = questions.length > 0 ? ((isSummary ? questions.length : currentStep + 1) / questions.length) * 100 : 100

  const selectedStressorLabels = stressors.map((stressor) => stressorLabels[stressor] || stressor)

  const buildAnswers = (values) =>
    questions.map((question) => {
      const fieldName = getFieldName(question)
      return {
        fieldName,
        questionId: question.id,
        stressorId: question.stressorId,
        stressorLabel: question.stressorLabel,
        question: question.question,
        answer: values[fieldName]
      }
    })

  const handleSaveProgress = () => {
    setStoreAnswers(buildAnswers(getValues()))
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }

  const handlePrevious = () => {
    if (isSummary) {
      setIsSummary(false)
      setCurrentStep(Math.max(questions.length - 1, 0))
      return
    }

    if (currentStep === 0) {
      prevStep()
      navigate(ROUTES.ONBOARDING_STRESSORS)
      return
    }

    setCurrentStep((step) => step - 1)
  }

  const handleNext = async () => {
    if (!currentFieldName) {
      setIsSummary(true)
      return
    }

    const isValid = await trigger(currentFieldName)
    if (!isValid) return

    handleSaveProgress()

    if (currentStep === questions.length - 1) {
      setIsSummary(true)
      return
    }

    setCurrentStep((step) => step + 1)
  }

  const renderQuestion = (question) => {
    const fieldName = getFieldName(question)
    const error = errors[fieldName]?.message

    if (question.type === 'slider') {
      const value = watch(fieldName) || Math.ceil(((question.min || 1) + (question.max || 10)) / 2)

      return (
        <Controller
          name={fieldName}
          control={control}
          defaultValue={value}
          rules={{ required: 'Please choose a value to continue' }}
          render={({ field }) => (
            <div>
              <div className="mb-6 flex items-end justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Low</span>
                <span className="rounded-2xl bg-primary-50 px-5 py-3 text-3xl font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                  {field.value}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">High</span>
              </div>
              <input
                type="range"
                min={question.min || 1}
                max={question.max || 10}
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-primary-600 dark:bg-gray-700"
              />
              {error && <p className="mt-3 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
            </div>
          )}
        />
      )
    }

    if (question.type === 'radio') {
      return (
        <Controller
          name={fieldName}
          control={control}
          rules={{ required: 'Please select an option' }}
          render={({ field }) => (
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => field.onChange(option)}
                    className={`rounded-2xl border-2 p-4 text-left font-semibold transition-all ${
                      field.value === option
                        ? 'border-primary-500 bg-primary-50 text-primary-800 shadow-soft dark:bg-primary-900/30 dark:text-primary-100'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-primary-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {error && <p className="mt-3 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
            </div>
          )}
        />
      )
    }

    if (question.type === 'multi-select') {
      return (
        <Controller
          name={fieldName}
          control={control}
          defaultValue={[]}
          rules={{
            validate: (value) => (value?.length ? true : 'Choose at least one option')
          }}
          render={({ field }) => (
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => {
                  const selected = field.value?.includes(option)
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        const nextValue = selected
                          ? field.value.filter((item) => item !== option)
                          : [...(field.value || []), option]
                        field.onChange(nextValue)
                      }}
                      className={`rounded-2xl border-2 p-4 text-left font-semibold transition-all ${
                        selected
                          ? 'border-primary-500 bg-primary-50 text-primary-800 shadow-soft dark:bg-primary-900/30 dark:text-primary-100'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-primary-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                      }`}
                    >
                      <span className="mr-2">{selected ? '✓' : '+'}</span>
                      {option}
                    </button>
                  )
                })}
              </div>
              {error && <p className="mt-3 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
            </div>
          )}
        />
      )
    }

    if (question.type === 'textarea') {
      return (
        <div>
          <textarea
            {...register(fieldName, { required: 'Please share a response' })}
            rows={5}
            placeholder="Write what feels true right now..."
            className="w-full resize-none rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {error && <p className="mt-3 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
        </div>
      )
    }

    return (
      <div>
        <input
          {...register(fieldName, { required: 'This field is required' })}
          type={question.type === 'number' ? 'number' : 'text'}
          min={question.type === 'number' ? 0 : undefined}
          placeholder={question.type === 'number' ? 'Enter a number' : 'Type your answer'}
          className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        {error && <p className="mt-3 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
      </div>
    )
  }

  const answerSummary = buildAnswers(getValues())

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 via-primary-50 to-accent-50 px-4 py-8 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center">
        <div className="w-full">
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
                Burnout assessment
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {isSummary ? 'Summary' : `Step ${Math.min(currentStep + 1, questions.length || 1)} of ${questions.length || 1}`}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/80 shadow-inner dark:bg-gray-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-success-500 via-primary-500 to-accent-500"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSummary ? (
              <motion.div
                key="summary"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="rounded-2xl p-6 shadow-lg-soft sm:p-8">
                  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-success-700 dark:text-success-300">
                        Assessment Summary
                      </p>
                      <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
                        Your wellness snapshot is ready.
                      </h1>
                    </div>
                    <div className="rounded-2xl bg-danger-50 px-5 py-4 text-center dark:bg-danger-900/20">
                      <p className="text-sm font-semibold text-danger-700 dark:text-danger-300">Burnout Score</p>
                      <p className="text-4xl font-bold text-danger-700 dark:text-danger-200">72%</p>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl bg-success-50 p-5 dark:bg-success-900/10">
                      <h2 className="mb-3 text-lg font-bold text-gray-950 dark:text-white">Selected Stressors</h2>
                      <div className="flex flex-wrap gap-2">
                        {selectedStressorLabels.map((label) => (
                          <span key={label} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-success-800 shadow-sm dark:bg-gray-800 dark:text-success-200">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-primary-50 p-5 dark:bg-primary-900/10">
                      <h2 className="mb-3 text-lg font-bold text-gray-950 dark:text-white">Burnout Analysis Preview</h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        Complete the assessment to calculate your risk level.
                      </p>
                      <p className="mt-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Primary Contributors:</p>
                      <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                        {selectedStressorLabels.slice(0, 2).map((label) => (
                          <li key={label} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary-600" />
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-900/60">
                    <h2 className="mb-4 text-lg font-bold text-gray-950 dark:text-white">Answered Questions</h2>
                    <div className="space-y-4">
                      {answerSummary.map((answer) => (
                        <div key={answer.fieldName} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
                            {answer.stressorLabel}
                          </p>
                          <p className="font-semibold text-gray-950 dark:text-white">{answer.question}</p>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">{formatValue(answer.answer)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" size="lg" className="flex-1" onClick={handlePrevious}>
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Previous
                    </Button>
                    <Button variant="primary" size="lg" className="flex-1" onClick={() => navigate(ROUTES.DASHBOARD)}>
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      View Dashboard
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="rounded-2xl p-6 shadow-lg-soft sm:p-10">
                  {currentQuestion ? (
                    <>
                      <div className="mb-8">
                        <span className="mb-4 inline-flex rounded-full bg-success-50 px-4 py-2 text-sm font-semibold text-success-700 dark:bg-success-900/20 dark:text-success-200">
                          {currentQuestion.stressorLabel}
                        </span>
                        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-gray-950 dark:text-white sm:text-4xl">
                          {currentQuestion.question}
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                          Take a moment and answer in the way that feels most accurate today.
                        </p>
                      </div>

                      {renderQuestion(currentQuestion)}
                    </>
                  ) : (
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-gray-950 dark:text-white">No extra questions needed.</h1>
                      <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-300">
                        Your selected stressors do not have follow-up questions yet. Continue to see your summary.
                      </p>
                    </div>
                  )}

                  <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-6 dark:border-gray-700 sm:flex-row sm:items-center">
                    <Button variant="outline" size="lg" className="sm:w-40" onClick={handlePrevious}>
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Previous
                    </Button>
                    <Button variant="ghost" size="lg" className="sm:ml-auto" onClick={handleSaveProgress}>
                      <Save className="mr-2 h-5 w-5" />
                      Save Progress
                    </Button>
                    <Button variant="primary" size="lg" className="sm:w-40" onClick={handleNext}>
                      {currentStep === questions.length - 1 || !currentQuestion ? 'Finish' : 'Next'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  {savedAt && (
                    <p className="mt-4 text-center text-sm font-medium text-success-700 dark:text-success-300">
                      Progress saved at {savedAt}
                    </p>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
