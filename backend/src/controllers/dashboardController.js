const Assessment = require('../models/Assessment')
const WellnessReminder = require('../models/WellnessReminder')
const buildReminderSuggestions = require('../utils/wellnessReminderRules')
// @desc    Get dashboard data for a user
// @route   GET /api/dashboard/:userId
const getDashboardData = async (req, res, next) => {
  try {
    const { userId } = req.params

    const assessments = await Assessment.find({ userId }).sort({ createdAt: 1 })
    const latestAssessment = assessments[assessments.length - 1]

    const stressors = latestAssessment?.stressors || []
    const mainStressor = findMainStressor(latestAssessment) || stressors[0] || 'Not identified'
    const reminders = await getReminderSnapshot(userId)

    res.json({
      burnoutScore: latestAssessment?.burnoutScore || 0,
      riskLevel: formatRiskLevel(latestAssessment?.riskLevel || 'Low'),
      moodToday: formatLabel(latestAssessment?.mood || 'Not set'),
      mainStressor: formatLabel(mainStressor),
      trendData: buildTrendData(assessments),
      stressorBreakdown: buildStressorBreakdown(latestAssessment),
      recommendations: generateRecommendations(latestAssessment),
      reminderSuggestions: buildReminderSuggestions(latestAssessment),
      wellnessTracker: buildWellnessTracker(reminders),
      reminders,
      recentJournal: latestAssessment?.ventJournal
        ? {
            id: latestAssessment._id,
            content: latestAssessment.ventJournal,
            date: latestAssessment.createdAt,
            mood: latestAssessment.mood
          }
        : null
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get burnout trend graph data
// @route   GET /api/dashboard/trends/:userId
const getTrendData = async (req, res, next) => {
  try {
    const { userId } = req.params

    const assessments = await Assessment.find({ userId })
      .sort({ createdAt: 1 })

    res.json(buildTrendData(assessments))
  } catch (error) {
    next(error)
  }
}

// @desc    Forecast burnout score for the next 7 days
// @route   GET /api/dashboard/forecast/:userId
const getBurnoutForecast = async (req, res, next) => {
  try {
    const { userId } = req.params
    const assessments = await Assessment.find({ userId }).sort({ createdAt: 1 })
    const latestAssessment = assessments[assessments.length - 1]
    const reminders = await getReminderSnapshot(userId)

    res.json(buildBurnoutForecast(assessments, latestAssessment, reminders))
  } catch (error) {
    next(error)
  }
}

const buildTrendData = (assessments) => {
  return assessments.map((assessment, index) => ({
    week: `Entry ${index + 1}`,
    score: assessment.burnoutScore,
    burnoutScore: assessment.burnoutScore,
    riskLevel: assessment.riskLevel,
    date: assessment.createdAt
  }))
}

const todayKey = () => new Date().toISOString().slice(0, 10)

const getReminderSnapshot = async (userId) => {
  const reminders = await WellnessReminder.find({ userId }).lean()
  const today = todayKey()

  return reminders.map((reminder) => ({
    ...reminder,
    completedToday: reminder.lastTrackedDate === today ? reminder.completedToday : 0,
    lastTrackedDate: reminder.lastTrackedDate === today ? reminder.lastTrackedDate : today
  }))
}

const buildWellnessTracker = (reminders) => {
  const byType = reminders.reduce((result, reminder) => {
    result[reminder.type] = reminder
    return result
  }, {})

  return {
    water: {
      completed: byType.water?.completedToday || 0,
      goal: byType.water?.dailyGoal || 8
    },
    stepsToday: 0,
    breaksTaken: byType.break?.completedToday || 0,
    exerciseCompleted: (byType.exercise?.completedToday || 0) > 0,
    enabledReminders: reminders
      .filter((reminder) => reminder.enabled)
      .map((reminder) => reminder.type)
  }
}

const buildBurnoutForecast = (assessments, latestAssessment, reminders) => {
  if (!latestAssessment) {
    return {
      currentBurnout: 0,
      predictedBurnout: 0,
      change: 0,
      trend: 'Stable',
      warning: 'Take an assessment to unlock your burnout forecast'
    }
  }

  const responses = latestAssessment.numericScores || latestAssessment.responses || {}
  const raw = latestAssessment.rawAnswers || {}
  const lifestyle = raw.lifestyle || {}
  const byType = reminders.reduce((result, reminder) => {
    result[reminder.type] = reminder
    return result
  }, {})

  const currentBurnout = Math.round(latestAssessment.burnoutScore || 0)
  const recent = assessments.slice(-3)
  const trendDelta = recent.length >= 2
    ? (recent[recent.length - 1].burnoutScore || 0) - (recent[0].burnoutScore || 0)
    : 0

  let projectedChange = Math.round(trendDelta * 0.6)

  const sleepHours = Number(responses.sleepHours ?? 8)
  const sleepQuality = Number(responses.sleepQuality ?? 5)
  const waterGoal = byType.water?.dailyGoal || Number(lifestyle.life_3 || 8) || 8
  const waterCompleted = byType.water?.completedToday ?? Number(lifestyle.life_3 || 0)
  const exerciseDone = (byType.exercise?.completedToday || 0) > 0
  const breaksTaken = byType.break?.completedToday || 0
  const stressAverage = average([
    responses.studyPressure,
    responses.examStress,
    responses.careerAnxiety,
    responses.financialStress,
    responses.emotionalOverwhelm,
    responses.mentalExhaustion
  ], 0)

  if (sleepHours < 7) projectedChange += Math.round((7 - sleepHours) * 3)
  if (sleepQuality < 5) projectedChange += Math.round((5 - sleepQuality) * 2)
  if (waterCompleted < waterGoal) projectedChange += Math.min(8, Math.round((waterGoal - waterCompleted) * 1.2))
  if (!exerciseDone) projectedChange += 4
  if (breaksTaken < 2) projectedChange += 3
  if (stressAverage >= 7) projectedChange += 7
  if (stressAverage <= 3 && sleepHours >= 7) projectedChange -= 5

  projectedChange = Math.max(-25, Math.min(25, projectedChange))

  const predictedBurnout = Math.max(0, Math.min(100, currentBurnout + projectedChange))
  const change = predictedBurnout - currentBurnout
  const trend = change > 3 ? 'Rising' : change < -3 ? 'Improving' : 'Stable'
  const warning = trend === 'Rising'
    ? `Burnout likely to increase by ${change}% this week`
    : trend === 'Improving'
      ? `Your burnout is improving by ${Math.abs(change)}%`
      : 'Burnout is likely to remain stable this week'

  return {
    currentBurnout,
    predictedBurnout,
    change,
    trend,
    warning
  }
}

const average = (values, fallback = 0) => {
  const numericValues = values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))

  if (!numericValues.length) return fallback
  return numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
}

const buildStressorBreakdown = (assessment) => {
  if (!assessment) return []

  const responses = assessment.numericScores || assessment.responses || {}
  const selectedStressors = assessment.stressors || []
  const candidates = [
    { id: 'studies', name: 'Studies', value: responses.studyPressure || 0 },
    { id: 'exams', name: 'Exams', value: responses.examStress || 0 },
    { id: 'career', name: 'Career', value: responses.careerAnxiety || 0 },
    { id: 'sleep', name: 'Sleep', value: Math.max(10 - (responses.sleepQuality || 5), 10 - Math.min(responses.sleepHours || 8, 10)) },
    { id: 'financial', name: 'Financial', value: responses.financialStress || 0 },
    { id: 'physical_health', name: 'Physical Health', value: responses.physicalFatigue || 0 },
    { id: 'loneliness', name: 'Loneliness', value: responses.lonelinessScore || 0 },
    { id: 'time_management', name: 'Time Management', value: 10 - (responses.timeManagementScore || 5) },
    { id: 'family', name: 'Family', value: responses.familyPressure || 0 }
  ]

  const selected = candidates
    .filter((item) => selectedStressors.includes(item.id) || item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const total = selected.reduce((sum, item) => sum + item.value, 0)

  if (total <= 0) {
    return selectedStressors.slice(0, 5).map((id) => ({
      name: formatLabel(id.replace(/_/g, ' ')),
      value: Math.round(100 / Math.min(selectedStressors.length || 1, 5))
    }))
  }

  return selected.map((item) => ({
    name: item.name,
    value: Math.round((item.value / total) * 100)
  }))
}

// Helper: Generate recommendations based on assessment
const generateRecommendations = (assessment) => {
  if (!assessment) {
    return ['Take a wellness assessment to get personalized recommendations']
  }

  const recs = []
  const responses = assessment.numericScores || assessment.responses || {}
  const { burnoutScore } = assessment

  if (burnoutScore >= 70) {
    recs.push('Consider speaking with a counselor or mental health professional')
  }

  if ((responses?.sleepHours || 8) < 7) {
    recs.push('Sleep 7+ hours')
  }

  if ((responses?.sleepQuality || 5) < 5) {
    recs.push('Improve sleep quality by reducing screen time before bed')
  }

  if ((responses?.studyPressure || 0) > 6) {
    recs.push('Take breaks')
  }

  if ((responses?.mentalExhaustion || 0) > 6) {
    recs.push('Practice mindfulness or deep breathing exercises daily')
  }

  if ((assessment.stressors || []).includes('career') || (responses?.careerAnxiety || 0) > 6) {
    recs.push('Attend career counseling sessions to reduce placement anxiety')
  }

  if ((responses?.lonelinessScore || 0) > 6) {
    recs.push('Join student clubs or groups to build social connections')
  }

  if ((responses?.financialStress || 0) > 6) {
    recs.push('Explore scholarship options or speak with the financial aid office')
  }

  if ((responses?.physicalFatigue || 0) > 6) {
    recs.push('Incorporate light exercise like walking or stretching into your routine')
  }

  if (recs.length === 0) {
    recs.push('Sleep 7+ hours')
    recs.push('Take breaks')
  }

  return recs
}

const findMainStressor = (assessment) => {
  const breakdown = buildStressorBreakdown(assessment)
  return breakdown[0]?.name
}

const formatLabel = (value) => {
  if (!value) return value
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const formatRiskLevel = (riskLevel) => {
  if (riskLevel.endsWith('Risk')) return riskLevel
  return `${riskLevel} Risk`
}

module.exports = { getDashboardData, getTrendData, getBurnoutForecast }
