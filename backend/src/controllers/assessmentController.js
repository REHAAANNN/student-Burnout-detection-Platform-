const Assessment = require('../models/Assessment')
const calculateBurnout = require('../utils/burnoutCalculator')
const mapAssessmentAnswers = require('../utils/assessmentMapper')
const { updateStreaksForActivity } = require('../utils/streakService')

// @desc    Submit assessment and calculate burnout score
// @route   POST /api/assessment
const submitAssessment = async (req, res, next) => {
  try {
    const { userId, mood, stressors, responses, rawAnswers, ventJournal } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      })
    }

    const submittedRawAnswers = rawAnswers || req.body.answers || {}
    const hasRawAnswers = Object.keys(submittedRawAnswers).length > 0
    const derivedScores = hasRawAnswers ? mapAssessmentAnswers(submittedRawAnswers) : {}
    const numericScores = hasRawAnswers
      ? { ...(responses || {}), ...derivedScores }
      : (responses || {})
    const { burnoutScore, riskLevel } = calculateBurnout(numericScores)
    const calculatedScores = {
      ...numericScores,
      burnoutScore,
      riskLevel
    }

    const assessment = await Assessment.create({
      userId,
      mood: mood || submittedRawAnswers.mood?.mood || null,
      stressors: stressors || submittedRawAnswers.stressors || [],
      responses: numericScores,
      numericScores,
      rawAnswers: submittedRawAnswers,
      calculatedScores,
      ventJournal: ventJournal || submittedRawAnswers.ventJournal || '',
      burnoutScore,
      riskLevel
    })

    await updateStreaksForActivity(userId, 'wellness')

    res.status(201).json({
      success: true,
      burnoutScore,
      riskLevel,
      data: assessment
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get latest assessment for a user
// @route   GET /api/assessment/:userId
const getLatestAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ userId: req.params.userId })
      .sort({ createdAt: -1 })

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No assessment found for this user'
      })
    }

    res.json({
      success: true,
      data: assessment
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { submitAssessment, getLatestAssessment }
