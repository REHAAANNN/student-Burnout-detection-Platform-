const Streak = require('../models/Streak')

const todayKey = () => new Date().toISOString().slice(0, 10)

const publicStreak = (streak) => ({
  wellnessStreak: streak.wellnessStreak || 0,
  waterStreak: streak.waterStreak || 0,
  walkStreak: streak.walkStreak || 0,
  exerciseStreak: streak.exerciseStreak || 0
})

const getOrCreateStreak = async (userId) => {
  let streak = await Streak.findOne({ userId })

  if (!streak) {
    streak = await Streak.create({ userId })
  }

  return streak
}

const incrementOncePerDay = (streak, field, dateField, today) => {
  if (streak[dateField] === today) return false

  streak[field] = (streak[field] || 0) + 1
  streak[dateField] = today
  streak.lastUpdated = new Date()
  return true
}

const updateStreaksForActivity = async (userId, activity) => {
  if (!userId) return null

  const streak = await getOrCreateStreak(userId)
  const today = todayKey()

  incrementOncePerDay(streak, 'wellnessStreak', 'lastWellnessDate', today)

  if (activity === 'water') {
    incrementOncePerDay(streak, 'waterStreak', 'lastWaterDate', today)
  }

  if (activity === 'walk') {
    incrementOncePerDay(streak, 'walkStreak', 'lastWalkDate', today)
  }

  if (activity === 'exercise') {
    incrementOncePerDay(streak, 'exerciseStreak', 'lastExerciseDate', today)
  }

  await streak.save()
  return publicStreak(streak)
}

module.exports = {
  getOrCreateStreak,
  publicStreak,
  updateStreaksForActivity
}
