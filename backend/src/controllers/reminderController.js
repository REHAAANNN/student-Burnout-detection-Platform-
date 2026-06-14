const WellnessReminder = require('../models/WellnessReminder')
const { updateStreaksForActivity } = require('../utils/streakService')

const DEFAULTS = {
  water: {
    startTime: '06:00',
    endTime: '22:00',
    frequencyHours: 2,
    dailyGoal: 8
  },
  walk: {
    startTime: '08:00',
    endTime: '20:00',
    frequencyHours: 2,
    dailyGoal: 1
  },
  break: {
    startTime: '08:00',
    endTime: '22:00',
    frequencyHours: 2,
    dailyGoal: 4
  },
  exercise: {
    startTime: '06:00',
    endTime: '18:00',
    frequencyHours: 12,
    dailyGoal: 1,
    morningEnabled: true,
    eveningEnabled: true
  }
}

const todayKey = () => new Date().toISOString().slice(0, 10)

const resetIfNewDay = (reminder) => {
  const today = todayKey()
  if (reminder.lastTrackedDate !== today) {
    reminder.completedToday = 0
    reminder.lastTrackedDate = today
  }
  return reminder
}

const ensureReminder = async (userId, type) => {
  const defaults = DEFAULTS[type]
  let reminder = await WellnessReminder.findOne({ userId, type })

  if (!reminder) {
    reminder = await WellnessReminder.create({
      userId,
      type,
      ...defaults,
      lastTrackedDate: todayKey()
    })
  }

  resetIfNewDay(reminder)
  return reminder.save()
}

const getReminders = async (req, res, next) => {
  try {
    const { userId } = req.params
    const reminders = await Promise.all(
      Object.keys(DEFAULTS).map((type) => ensureReminder(userId, type))
    )

    res.json({
      success: true,
      data: reminders
    })
  } catch (error) {
    next(error)
  }
}

const updateReminder = async (req, res, next) => {
  try {
    const { userId, type } = req.params

    if (!DEFAULTS[type]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reminder type'
      })
    }

    const allowed = [
      'enabled',
      'startTime',
      'endTime',
      'frequencyHours',
      'dailyGoal',
      'morningEnabled',
      'eveningEnabled'
    ]
    const updates = allowed.reduce((nextUpdates, key) => {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        nextUpdates[key] = req.body[key]
      }
      return nextUpdates
    }, {})

    let reminder = await WellnessReminder.findOne({ userId, type })

    if (!reminder) {
      reminder = new WellnessReminder({
        userId,
        type,
        ...DEFAULTS[type],
        lastTrackedDate: todayKey()
      })
    }

    Object.assign(reminder, updates)

    resetIfNewDay(reminder)
    await reminder.save()

    res.json({
      success: true,
      data: reminder
    })
  } catch (error) {
    next(error)
  }
}

const trackReminder = async (req, res, next) => {
  try {
    const { userId, type } = req.params
    const amount = Number(req.body.amount || 1)

    if (!DEFAULTS[type]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reminder type'
      })
    }

    const reminder = await ensureReminder(userId, type)
    reminder.completedToday = Math.max(0, reminder.completedToday + amount)
    reminder.lastTrackedDate = todayKey()
    await reminder.save()

    if (type === 'walk' || type === 'exercise') {
      await updateStreaksForActivity(userId, type)
    }

    if (type === 'water' && reminder.completedToday >= reminder.dailyGoal) {
      await updateStreaksForActivity(userId, 'water')
    }

    res.json({
      success: true,
      data: reminder
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getReminders, updateReminder, trackReminder }
