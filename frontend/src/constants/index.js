/**
 * Application-wide constants
 */

export const APP_NAME = 'Burnout Guard'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_REGISTER_OTP: '/verify-register-otp',
  VERIFY_LOGIN_OTP: '/verify-login-otp',
  ONBOARDING_MOOD: '/onboarding/mood',
  ONBOARDING_STRESSORS: '/onboarding/stressors',
  ONBOARDING_ASSESSMENT: '/onboarding/assessment',
  DASHBOARD: '/dashboard',
  JOURNAL: '/journal',
  RECOMMENDATIONS: '/recommendations',
  NOT_FOUND: '*'
}

export const MOOD_OPTIONS = [
  { id: 'great', label: 'Great', emoji: '😄', color: 'success' },
  { id: 'good', label: 'Good', emoji: '😊', color: 'success' },
  { id: 'okay', label: 'Okay', emoji: '😐', color: 'warning' },
  { id: 'stressed', label: 'Stressed', emoji: '😰', color: 'warning' },
  { id: 'exhausted', label: 'Exhausted', emoji: '😫', color: 'danger' }
]

export const STRESSOR_OPTIONS = [
  { id: 'studies', label: 'Studies' },
  { id: 'exams', label: 'Exams' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'family', label: 'Family' },
  { id: 'friends', label: 'Friends' },
  { id: 'relationship', label: 'Relationship' },
  { id: 'career', label: 'Career' },
  { id: 'financial', label: 'Financial Issues' },
  { id: 'health', label: 'Health' },
  { id: 'other', label: 'Other' }
]

export const RISK_LEVELS = {
  LOW: 'Low Risk',
  MODERATE: 'Moderate Risk',
  HIGH: 'High Risk'
}

export const RISK_COLORS = {
  'Low Risk': 'success',
  'Moderate Risk': 'warning',
  'High Risk': 'danger'
}

const PRODUCTION_API_URL = 'https://student-burnout-detection-platform.vercel.app/api'
const configuredApiUrl = import.meta.env.VITE_API_URL
const isLocalApiUrl = configuredApiUrl?.includes('localhost') || configuredApiUrl?.includes('127.0.0.1')

export const API_BASE_URL =
  import.meta.env.PROD && isLocalApiUrl
    ? PRODUCTION_API_URL
    : configuredApiUrl || (import.meta.env.PROD ? PRODUCTION_API_URL : 'http://localhost:5000/api')

export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'burnout_guard_onboarding_completed'
}

export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: 'How many hours do you typically study per week?',
    options: ['<10', '10-20', '20-30', '30-40', '>40']
  },
  {
    id: 2,
    question: 'How would you rate your sleep quality?',
    options: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor']
  },
  {
    id: 3,
    question: 'How often do you take breaks during study sessions?',
    options: ['Every 30 mins', 'Every hour', 'Every 2 hours', 'Rarely', 'Never']
  },
  {
    id: 4,
    question: 'How do you handle academic stress?',
    options: ['Very Well', 'Well', 'Fairly Well', 'Poorly', 'Very Poorly']
  },
  {
    id: 5,
    question: 'How much time do you spend on physical activity?',
    options: ['Daily', '3-4 times/week', '1-2 times/week', 'Rarely', 'Never']
  }
]

export const RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Reduce Continuous Study Sessions',
    description: 'Break your study time into 25-50 minute sessions with 5-10 minute breaks',
    category: 'Study Habits',
    icon: 'BookOpen'
  },
  {
    id: 2,
    title: 'Prioritize Sleep This Week',
    description: 'Aim for 7-9 hours of quality sleep. Your mind needs rest to process information',
    category: 'Sleep',
    icon: 'Moon'
  },
  {
    id: 3,
    title: 'Take Regular Breaks',
    description: 'Step away from your desk every hour. Short walks help reset focus',
    category: 'Wellness',
    icon: 'Wind'
  },
  {
    id: 4,
    title: 'Practice Stress Management',
    description: 'Try meditation, deep breathing, or journaling for 10 minutes daily',
    category: 'Mental Health',
    icon: 'Heart'
  },
  {
    id: 5,
    title: 'Stay Connected',
    description: 'Spend time with friends and family. Social support reduces stress',
    category: 'Social',
    icon: 'Users'
  },
  {
    id: 6,
    title: 'Exercise Regularly',
    description: 'Physical activity reduces anxiety and improves mood. Even 20 minutes helps',
    category: 'Exercise',
    icon: 'Zap'
  }
]

export const SUPPORT_RESOURCES = [
  {
    id: 1,
    name: 'Campus Counselor',
    description: 'Professional counseling services available on campus',
    icon: 'Users',
    link: '#'
  },
  {
    id: 2,
    name: 'Mental Health Resources',
    description: 'Access to mental health support and educational materials',
    icon: 'BookOpen',
    link: '#'
  },
  {
    id: 3,
    name: 'Emergency Support',
    description: 'Immediate help and crisis support available 24/7',
    icon: 'AlertCircle',
    link: '#'
  },
  {
    id: 4,
    name: 'Wellness Center',
    description: 'Holistic wellness programs and fitness classes',
    icon: 'Heart',
    link: '#'
  }
]
