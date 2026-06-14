const {
  getOrCreateStreak,
  publicStreak,
  updateStreaksForActivity
} = require('../utils/streakService')

// @desc    Get streaks for a user
// @route   GET /api/streaks/:userId
const getStreaks = async (req, res, next) => {
  try {
    const streak = await getOrCreateStreak(req.params.userId)
    res.json(publicStreak(streak))
  } catch (error) {
    next(error)
  }
}

// @desc    Update streaks after a wellness activity
// @route   POST /api/streaks/update
const updateStreaks = async (req, res, next) => {
  try {
    const { userId, activity = 'wellness' } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      })
    }

    const streaks = await updateStreaksForActivity(userId, activity)
    res.json({
      success: true,
      data: streaks
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getStreaks, updateStreaks }
