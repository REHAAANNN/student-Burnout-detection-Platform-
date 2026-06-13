import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Save,
  RefreshCw,
  Heart,
  AlertTriangle,
  Activity,
  FileText,
  Sun,
  MessageSquare,
  CheckCircle2,
  Brain,
  Clock,
  Moon,
  BookOpen,
  Briefcase,
  Users,
  UserPlus,
  CreditCard,
  Frown,
  MoreHorizontal,
  MessageCircle,
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  HelpCircle
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import toast from 'react-hot-toast'
import { useAssessmentStore } from '../../store/assessmentStore'
import { useAuthStore } from '../../store/authStore'
import { assessmentService } from '../../services/assessmentService'
import {
  STRESSOR_SELECTION,
  STRESSOR_QUESTIONS,
  ASSESSMENT_SECTIONS
} from '../../constants/questionBank'
import { ROUTES } from '../../constants'

// ─── Animation Variants ───────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.97 }
}

const questionVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } }
}

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// ─── Icon Map ─────────────────────────────────────────────────
const ICON_MAP = {
  Heart, AlertTriangle, Activity, FileText, Sun, MessageSquare,
  BookOpen, FileCheck, ClipboardList, Moon, Users, UserPlus,
  Briefcase, CreditCard, Brain, Frown, MoreHorizontal, MessageCircle, Clock
}

const getIcon = (iconName) => ICON_MAP[iconName] || HelpCircle

// ─── Section Indicator ────────────────────────────────────────
const SectionIndicator = ({ sections, currentSection, onSectionClick }) => {
  const completedSections = (idx) => {
    const store = useAssessmentStore.getState()
    if (idx === 0) return store.mood !== null
    if (idx === 1) return store.stressors.length > 0
    if (idx === 2) return Object.keys(store.coreAnswers).length >= 5
    if (idx === 3) return Object.keys(store.stressorAnswers).length > 0
    if (idx === 4) return Object.keys(store.lifestyleAnswers).length >= 4
    if (idx === 5) return true
    return false
  }

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex min-w-max gap-2 sm:gap-3">
        {sections.map((section, idx) => {
          const Icon = getIcon(section.icon)
          const isActive = idx === currentSection
          const isCompleted = completedSections(idx)
          const isPast = idx < currentSection

          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(idx)}
              className={`group relative flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                  : isCompleted || isPast
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : isCompleted
                  ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {isCompleted || isPast ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </span>
              <div className="hidden sm:block text-left">
                <p className="text-xs opacity-80">
                  {isCompleted ? 'Completed' : `Section ${idx + 1}`}
                </p>
                <p className="font-semibold">{section.title}</p>
              </div>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-indigo-600" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Progress Bar ────────────────────────────────────────────
const ProgressBar = ({ progress }) => (
  <div className="mb-6">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
        Assessment Progress
      </span>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {Math.round(progress)}%
      </span>
    </div>
    <div className="h-3 overflow-hidden rounded-full bg-white/80 shadow-inner dark:bg-gray-800">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500"
        initial={false}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  </div>
)

// ─── Question Renderers ──────────────────────────────────────
const EmojiSelect = ({ options, value, onChange }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
    {options.map((option) => {
      const isSelected = value === option.id
      const colorMap = {
        success: 'emerald',
        warning: 'amber',
        danger: 'red',
        info: 'blue'
      }
      const c = colorMap[option.color] || 'indigo'
      return (
        <motion.button
          key={option.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(option.id)}
          className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all duration-200 ${
            isSelected
              ? `border-${c}-500 bg-${c}-50 shadow-soft dark:bg-${c}-900/20`
              : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-soft dark:border-gray-700 dark:bg-gray-800'
          }`}
        >
          <span className="text-4xl">{option.emoji}</span>
          <span className={`text-sm font-semibold ${
            isSelected ? `text-${c}-700 dark:text-${c}-300` : 'text-gray-700 dark:text-gray-300'
          }`}>
            {option.label}
          </span>
        </motion.button>
      )
    })}
  </div>
)

const SliderInput = ({ question, value, onChange }) => {
  const [localValue, setLocalValue] = useState(
    value || Math.ceil(((question.min || 1) + (question.max || 10)) / 2)
  )

  // Initialize store with default value on mount
  useEffect(() => {
    if (value === null || value === undefined) {
      const defaultVal = Math.ceil(((question.min || 1) + (question.max || 10)) / 2)
      onChange(defaultVal)
    }
  }, [])

  useEffect(() => {
    if (value !== undefined && value !== null) setLocalValue(value)
  }, [value])

  const handleChange = (e) => {
    const val = Number(e.target.value)
    setLocalValue(val)
    onChange(val)
  }

  const min = question.min || 1
  const max = question.max || 10
  const pct = ((localValue - min) / (max - min)) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {question.lowLabel || 'Low'}
        </span>
        <motion.span
          key={localValue}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-3xl font-bold text-indigo-700 shadow-inner dark:from-indigo-900/40 dark:to-indigo-800/40 dark:text-indigo-200"
        >
          {localValue}
        </motion.span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {question.highLabel || 'High'}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={localValue}
        onChange={handleChange}
        className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-indigo-600 dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`
        }}
      />
      <div className="flex justify-between px-1">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`h-2 w-2 rounded-full transition-all ${
              localValue === num
                ? 'bg-indigo-600 scale-150'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const ScaleSelect = ({ question, value, onChange }) => {
  const options = question.options || ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  const colorClasses = [
    'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-soft dark:bg-emerald-900/30 dark:text-emerald-200',
    'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-soft dark:bg-emerald-900/30 dark:text-emerald-200',
    'border-amber-500 bg-amber-50 text-amber-800 shadow-soft dark:bg-amber-900/30 dark:text-amber-200',
    'border-red-500 bg-red-50 text-red-800 shadow-soft dark:bg-red-900/30 dark:text-red-200',
    'border-red-500 bg-red-50 text-red-800 shadow-soft dark:bg-red-900/30 dark:text-red-200'
  ]
  const defaultClass = 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:shadow-soft dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {options.map((option, idx) => {
        const isSelected = value === option
        return (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(option)}
            className={`rounded-2xl border-2 p-4 text-center font-semibold transition-all duration-200 ${
              isSelected ? colorClasses[idx] || colorClasses[0] : defaultClass
            }`}
          >
            {option}
          </motion.button>
        )
      })}
    </div>
  )
}

const RadioSelect = ({ options, value, onChange }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {(options || []).map((option) => {
      const isSelected = value === option
      return (
        <motion.button
          key={option}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(option)}
          className={`rounded-2xl border-2 p-4 text-left font-semibold transition-all duration-200 ${
            isSelected
              ? 'border-indigo-500 bg-indigo-50 text-indigo-800 shadow-soft dark:bg-indigo-900/30 dark:text-indigo-100'
              : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:shadow-soft dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          <span className={`mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
            isSelected
              ? 'border-indigo-500 bg-indigo-500 text-white'
              : 'border-gray-300 dark:border-gray-600'
          }`}>
            {isSelected ? '\u2713' : ''}
          </span>
          {option}
        </motion.button>
      )
    })}
  </div>
)

const NumberInput = ({ question, value, onChange }) => {
  // Auto-initialize with 0 on mount for required number fields
  useEffect(() => {
    if ((value === null || value === undefined) && question.required) {
      onChange(0)
    }
  }, [])

  return (
    <div className="relative mx-auto max-w-xs">
      <input
        type="number"
        min={0}
        value={value === null || value === undefined ? '' : value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : 0)}
        placeholder="Enter a number"
        className="w-full rounded-2xl border-2 border-gray-200 bg-white/80 px-6 py-5 text-center text-2xl font-bold text-gray-900 outline-none backdrop-blur-sm transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white"
      />
    </div>
  )
}

const TextAreaInput = ({ question, value, onChange, maxLength }) => (
  <div>
    <textarea
      value={value || ''}
      onChange={(e) => {
        if (maxLength && e.target.value.length > maxLength) return
        onChange(e.target.value)
      }}
      rows={5}
      placeholder={question.placeholder || 'Write what feels true right now...'}
      className="w-full resize-none rounded-2xl border-2 border-gray-200 bg-white/80 px-6 py-5 text-lg text-gray-900 outline-none backdrop-blur-sm transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white"
    />
    {maxLength && (
      <div className="mt-2 flex justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Share as much or as little as you'd like
        </p>
        <p className={`text-sm font-medium ${
          (value?.length || 0) > maxLength * 0.9
            ? 'text-red-600'
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {value?.length || 0} / {maxLength}
        </p>
      </div>
    )}
  </div>
)

// ─── Stressor Card ───────────────────────────────────────────
const StressorCard = ({ stressor, isSelected, onToggle }) => {
  const Icon = getIcon(stressor.icon)

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onToggle(stressor.id)}
      className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
        isSelected
          ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-amber-50 shadow-soft dark:from-indigo-900/30 dark:to-amber-900/20'
          : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-soft dark:border-gray-700 dark:bg-gray-800'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
          isSelected
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${
            isSelected ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-900 dark:text-white'
          }`}>
            {stressor.label}
          </p>
          <p className={`mt-1 text-sm ${
            isSelected ? 'text-indigo-600/80 dark:text-indigo-300/80' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {stressor.description}
          </p>
        </div>
        <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          isSelected
            ? 'border-indigo-500 bg-indigo-500 text-white'
            : 'border-gray-300 dark:border-gray-600'
        }`}>
          {isSelected && <CheckCircle2 className="h-4 w-4" />}
        </div>
      </div>
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/30" />
      )}
    </motion.button>
  )
}

// ─── Main Component ──────────────────────────────────────────
export const AdvancedAssessment = () => {
  const navigate = useNavigate()
  const store = useAssessmentStore()
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // All sections with dynamic questions for section 4
  const sections = useMemo(() => {
    const dynamicQuestions = store.stressors.flatMap(
      (stressorId) => STRESSOR_QUESTIONS[stressorId] || []
    )

    return ASSESSMENT_SECTIONS.map((section) => {
      if (section.id === 'dynamic') {
        return {
          ...section,
          questions: dynamicQuestions,
          subtitle: `${store.stressors.length} area(s) selected · ${dynamicQuestions.length} question(s)`
        }
      }
      return section
    })
  }, [store.stressors])

  const currentSection = sections[store.currentSection]
  const currentQuestions = currentSection?.questions || []
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0)

  const answeredQuestions = useMemo(() => {
    const s = useAssessmentStore.getState()
    let count = 0
    if (s.mood) count += 1
    if (s.energyLevel) count += 1
    if (s.overwhelmedLevel) count += 1
    if (s.mentalExhaustion) count += 1
    count += Object.keys(s.coreAnswers).length
    count += Object.keys(s.stressorAnswers).length
    count += Object.keys(s.lifestyleAnswers).length
    if (s.ventJournal) count += 1
    return count
  }, [
    store.mood, store.energyLevel, store.overwhelmedLevel, store.mentalExhaustion,
    store.coreAnswers, store.stressorAnswers, store.lifestyleAnswers, store.ventJournal
  ])

  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  // Scroll to top on question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [store.currentQuestionIndex, store.currentSection])

  // ─── Handlers ──────────────────────────────────────────────
  const handleSaveProgress = useCallback(() => {
    store.setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    toast.success('Progress saved!')
  }, [store])

  const handleSectionClick = (idx) => {
    store.goToSection(idx)
  }

  const handleCompleteAssessment = useCallback(async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      const answers = store.getAllAnswers()
      const userId = user?.id || user?._id

      const result = await assessmentService.submitAssessment(answers, userId)
      setAssessmentResult(result)
      store.setCompleted(true)
      handleSaveProgress()
      toast.success('Assessment saved!')
      navigate(ROUTES.DASHBOARD)
    } catch (error) {
      toast.error(error.message || 'Could not save assessment')
    } finally {
      setIsSubmitting(false)
    }
  }, [handleSaveProgress, isSubmitting, navigate, store, user])

  const handleNext = useCallback(async () => {
    // Stressor selection is a full-page view, skip to next section directly
    if (currentSection?.id === 'stressors' || currentSection?.id === 'dynamic') {
      if (store.currentSection < sections.length - 1) {
        handleSaveProgress()
        store.nextSection()
      } else {
        await handleCompleteAssessment()
      }
      return
    }

    // Question-by-question navigation for other sections
    if (store.currentQuestionIndex < currentQuestions.length - 1) {
      store.nextQuestion()
    } else {
      if (store.currentSection < sections.length - 1) {
        handleSaveProgress()
        store.nextSection()
      } else {
        await handleCompleteAssessment()
      }
    }
  }, [store, currentQuestions.length, sections.length, handleSaveProgress, currentSection, handleCompleteAssessment])

  const handlePrevious = useCallback(() => {
    if (store.currentQuestionIndex > 0) {
      store.prevQuestion()
    } else {
      if (store.currentSection > 0) {
        store.prevSection()
      } else {
        navigate(ROUTES.DASHBOARD)
      }
    }
  }, [store, navigate])

  // ─── Current Question ──────────────────────────────────────
  const currentQuestion = currentQuestions[store.currentQuestionIndex]
  const isLastQuestion = store.currentQuestionIndex >= currentQuestions.length - 1
  const isLastSection = store.currentSection >= sections.length - 1

  const renderQuestion = (question) => {
    const getValue = () => {
      const s = useAssessmentStore.getState()
      if (question.id === 'mood_1') return s.mood
      if (question.id === 'mood_2') return s.energyLevel
      if (question.id === 'mood_3') return s.overwhelmedLevel
      if (question.id === 'mood_4') return s.mentalExhaustion
      if (question.id.startsWith('core_')) return s.coreAnswers[question.id]
      if (question.id.startsWith('life_')) return s.lifestyleAnswers[question.id]
      if (question.id === 'vent_1') return s.ventJournal
      return s.stressorAnswers[question.id]
    }

    const getSetter = () => {
      if (question.id === 'mood_1') return store.setMood
      if (question.id === 'mood_2') return store.setEnergyLevel
      if (question.id === 'mood_3') return store.setOverwhelmedLevel
      if (question.id === 'mood_4') return store.setMentalExhaustion
      if (question.id.startsWith('core_')) return (val) => store.setCoreAnswer(question.id, val)
      if (question.id.startsWith('life_')) return (val) => store.setLifestyleAnswer(question.id, val)
      if (question.id === 'vent_1') return store.setVentJournal
      return (val) => store.setStressorAnswer(question.id, val)
    }

    const value = getValue()
    const setter = getSetter()

    if (question.type === 'emoji-select') {
      return <EmojiSelect options={question.options} value={value} onChange={setter} />
    }
    if (question.type === 'slider') {
      return <SliderInput question={question} value={value} onChange={setter} />
    }
    if (question.type === 'scale') {
      return <ScaleSelect question={question} value={value} onChange={setter} />
    }
    if (question.type === 'radio') {
      return <RadioSelect options={question.options} value={value} onChange={setter} />
    }
    if (question.type === 'number') {
      return <NumberInput question={question} value={value} onChange={setter} />
    }
    if (question.type === 'textarea' || question.type === 'journal') {
      return (
        <TextAreaInput
          question={question}
          value={value}
          onChange={setter}
          maxLength={question.maxLength || 2000}
        />
      )
    }
    return <NumberInput question={question} value={value} onChange={setter} />
  }

  const canProceed = useCallback(() => {
    if (!currentQuestion) return true
    if (!currentQuestion.required) return true
    if (currentQuestion.id === 'vent_1') return true

    // Slider and number types auto-initialize, so they are always answerable
    if (currentQuestion.type === 'slider' || currentQuestion.type === 'number') return true

    const val = (() => {
      if (currentQuestion.id === 'mood_1') return store.mood
      if (currentQuestion.id === 'mood_2') return store.energyLevel
      if (currentQuestion.id === 'mood_3') return store.overwhelmedLevel
      if (currentQuestion.id === 'mood_4') return store.mentalExhaustion
      if (currentQuestion.id.startsWith('core_')) return store.coreAnswers[currentQuestion.id]
      if (currentQuestion.id.startsWith('life_')) return store.lifestyleAnswers[currentQuestion.id]
      return store.stressorAnswers[currentQuestion.id]
    })()

    return val !== null && val !== undefined && val !== ''
  }, [currentQuestion, store])

  // Summary View
  if (store.completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-indigo-50 to-amber-50 px-4 py-12 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden rounded-3xl shadow-xl-soft">
              <div className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 p-8 text-white sm:p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.div>
                <h1 className="text-center text-3xl font-bold sm:text-4xl">Assessment Completed</h1>
                <p className="mt-2 text-center text-lg text-white/80">
                  Your wellness snapshot is ready. Here's your burnout overview.
                </p>
              </div>

              <div className="p-6 sm:p-10">
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-6 text-center dark:from-red-900/20 dark:to-red-900/20">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">
                      Burnout Score
                    </p>
                    <motion.p
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className="text-5xl font-bold text-red-700 dark:text-red-200"
                    >
                      {assessmentResult?.burnoutScore ?? 0}%
                    </motion.p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 text-center dark:from-amber-900/20 dark:to-amber-900/20">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                      Risk Level
                    </p>
                    <motion.p
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring' }}
                      className="text-4xl font-bold text-amber-700 dark:text-amber-200"
                    >
                      {assessmentResult?.riskLevel ? `${assessmentResult.riskLevel} Risk` : 'Not Set'}
                    </motion.p>
                  </div>
                </div>

                <div className="mb-8 rounded-2xl bg-indigo-50 p-6 dark:bg-indigo-900/10">
                  <h2 className="mb-4 text-lg font-bold text-gray-950 dark:text-white">
                    Primary Burnout Drivers
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {store.stressors.slice(0, 5).map((stressorId) => {
                      const stressorObj = STRESSOR_SELECTION.find((s) => s.id === stressorId)
                      const label = stressorObj?.label || stressorId
                      const Icon = getIcon(stressorObj?.icon || 'HelpCircle')
                      return (
                        <motion.span
                          key={stressorId}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 }}
                          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-800 shadow-sm dark:bg-gray-800 dark:text-indigo-200"
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </motion.span>
                      )
                    })}
                  </div>
                </div>

                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/10">
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                      {store.mood ? '\u2713' : '\u2014'}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Mood Logged
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/10">
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {store.stressors.length}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Stressors Identified
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-900/10">
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                      {answeredQuestions}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Questions Answered
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex-1"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => navigate(ROUTES.DASHBOARD)}
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      View Dashboard
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        store.setCompleted(false)
                        store.reset()
                        navigate(ROUTES.ONBOARDING_ASSESSMENT)
                      }}
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Retake Assessment
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Stressor Selection View (Section 2 is special)
  if (currentSection?.id === 'stressors') {
    return (
      <div ref={contentRef} className="min-h-screen bg-gradient-to-br from-emerald-50 via-indigo-50 to-amber-50 px-4 py-8 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-4xl">
          <SectionIndicator sections={sections} currentSection={store.currentSection} onSectionClick={handleSectionClick} />
          <ProgressBar progress={progress} />

          <AnimatePresence mode="wait">
            <motion.div
              key="stressors"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <Card className="rounded-2xl p-6 shadow-lg-soft sm:p-10">
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600"
                  >
                    <AlertTriangle className="h-7 w-7 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
                    What areas are currently affecting your wellbeing?
                  </h1>
                  <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                    Select all that apply. This helps us personalize your assessment.
                  </p>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid gap-4 sm:grid-cols-2"
                >
                  {STRESSOR_SELECTION.map((stressor) => (
                    <motion.div key={stressor.id} variants={staggerItem}>
                      <StressorCard
                        stressor={stressor}
                        isSelected={store.stressors.includes(stressor.id)}
                        onToggle={store.toggleStressor}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 dark:border-gray-700 sm:flex-row sm:items-center">
                  <Button variant="outline" size="lg" className="sm:w-40" onClick={handlePrevious} disabled={isSubmitting}>
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Previous
                  </Button>
                  <Button variant="ghost" size="lg" className="sm:ml-auto" onClick={handleSaveProgress} disabled={isSubmitting}>
                    <Save className="mr-2 h-5 w-5" />
                    Save Progress
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="sm:w-48"
                    onClick={handleNext}
                    disabled={store.stressors.length === 0 || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    {store.stressors.length > 0 ? `Continue (${store.stressors.length})` : 'Select at least 1'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {store.savedAt && (
                  <p className="mt-4 text-center text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Progress saved at {store.savedAt}
                  </p>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Empty state for dynamic section when no stressors selected
  if (currentSection?.id === 'dynamic' && currentQuestions.length === 0) {
    return (
      <div ref={contentRef} className="min-h-screen bg-gradient-to-br from-emerald-50 via-indigo-50 to-amber-50 px-4 py-8 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-4xl">
          <SectionIndicator sections={sections} currentSection={store.currentSection} onSectionClick={handleSectionClick} />
          <ProgressBar progress={progress} />

          <Card className="rounded-2xl p-10 text-center shadow-lg-soft">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
              No stressor-specific questions
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-600 dark:text-gray-400">
              You didn't select any specific stressors that have follow-up questions. You can skip this section.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button variant="outline" size="lg" onClick={handlePrevious} disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={handleNext} disabled={isSubmitting} isLoading={isSubmitting}>
                Skip Section
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Regular question view
  return (
    <div ref={contentRef} className="min-h-screen bg-gradient-to-br from-emerald-50 via-indigo-50 to-amber-50 px-4 py-8 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl">
        <SectionIndicator sections={sections} currentSection={store.currentSection} onSectionClick={handleSectionClick} />
        <ProgressBar progress={progress} />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSection?.id}-${store.currentQuestionIndex}`}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <Card className="rounded-2xl p-6 shadow-lg-soft sm:p-10">
              {currentQuestion && (
                <>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-amber-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:from-indigo-900/30 dark:to-amber-900/30 dark:text-indigo-200">
                      {React.createElement(getIcon(currentSection?.icon), { className: 'h-4 w-4' })}
                      {currentSection?.title}
                    </span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Q{store.currentQuestionIndex + 1} of {currentQuestions.length}
                    </span>
                  </div>

                  <motion.div
                    key={currentQuestion.id}
                    variants={questionVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="mb-2 text-2xl font-bold leading-tight text-gray-950 dark:text-white sm:text-3xl">
                      {currentQuestion.question}
                    </h1>
                    {currentQuestion.subtitle ? (
                      <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                        {currentQuestion.subtitle}
                      </p>
                    ) : (
                      <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
                        Take a moment and answer in the way that feels most accurate today.
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    key={`input-${currentQuestion.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="mb-8"
                  >
                    {renderQuestion(currentQuestion)}
                  </motion.div>
                </>
              )}

              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6 dark:border-gray-700 sm:flex-row sm:items-center">
                <Button variant="outline" size="lg" className="sm:w-40" onClick={handlePrevious} disabled={isSubmitting}>
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  {store.currentQuestionIndex > 0 ? 'Previous' : 'Back'}
                </Button>

                <Button variant="ghost" size="lg" className="sm:ml-auto" onClick={handleSaveProgress} disabled={isSubmitting}>
                  <Save className="mr-2 h-5 w-5" />
                  Save Progress
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="sm:w-48"
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  isLoading={isSubmitting}
                >
                  {isLastQuestion && isLastSection ? (
                    <>
                      Complete Assessment
                      <CheckCircle2 className="ml-2 h-5 w-5" />
                    </>
                  ) : isLastQuestion ? (
                    <>
                      Next Section
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              {store.savedAt && (
                <p className="mt-4 text-center text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Progress saved at {store.savedAt}
                </p>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
