const Assessment = require('../models/Assessment')
// @desc    Get dashboard data for a user
// @route   GET /api/dashboard/:userId
const getDashboardData = async (req, res, next) => {
  try {
    const { userId } = req.params

    const assessments = await Assessment.find({ userId }).sort({ createdAt: 1 })
    const latestAssessment = assessments[assessments.length - 1]

    const stressors = latestAssessment?.stressors || []
    const mainStressor = findMainStressor(latestAssessment) || stressors[0] || 'Not identified'

    res.json({
      burnoutScore: latestAssessment?.burnoutScore || 0,
      riskLevel: formatRiskLevel(latestAssessment?.riskLevel || 'Low'),
      moodToday: formatLabel(latestAssessment?.mood || 'Not set'),
      mainStressor: formatLabel(mainStressor),
      trendData: buildTrendData(assessments),
      stressorBreakdown: buildStressorBreakdown(latestAssessment),
      recommendations: generateRecommendations(latestAssessment),
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

const buildTrendData = (assessments) => {
  return assessments.map((assessment, index) => ({
    week: `Entry ${index + 1}`,
    score: assessment.burnoutScore,
    burnoutScore: assessment.burnoutScore,
    riskLevel: assessment.riskLevel,
    date: assessment.createdAt
  }))
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

module.exports = { getDashboardData, getTrendData }
