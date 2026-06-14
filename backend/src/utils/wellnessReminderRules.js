const SCALE_VALUES = {
  Never: 0,
  Rarely: 2.5,
  Sometimes: 5,
  Often: 7.5,
  Always: 10
}

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

const scale = (value, fallback = 0) => {
  if (typeof value === 'number') return value
  return SCALE_VALUES[value] ?? fallback
}

const buildReminderSuggestions = (assessment) => {
  if (!assessment) return []

  const responses = assessment.numericScores || assessment.responses || {}
  const raw = assessment.rawAnswers || {}
  const lifestyle = raw.lifestyle || {}
  const stressorSpecific = raw.stressorSpecific || {}
  const suggestions = []

  const waterGlasses = toNumber(lifestyle.life_3, 8)
  const headacheScore = scale(stressorSpecific.phys_2, 0)
  const fatigueScore = Math.max(toNumber(responses.physicalFatigue, 0), scale(stressorSpecific.phys_1, 0))
  const lowEnergy = toNumber(responses.energyLevel, 5) <= 4

  if (waterGlasses < 6 || fatigueScore >= 6 || headacheScore >= 6 || lowEnergy) {
    suggestions.push({
      type: 'water',
      title: 'Would you like hydration reminders?',
      reason: 'Your assessment suggests low hydration, fatigue, headaches, or lower energy.',
      defaults: {
        startTime: '06:00',
        endTime: '22:00',
        frequencyHours: 2,
        dailyGoal: 8
      }
    })
  }

  const exerciseDays = toNumber(lifestyle.life_2 ?? stressorSpecific.phys_3, 0)
  const screenTime = toNumber(lifestyle.life_1, 0)

  if (exerciseDays < 3 || screenTime >= 8) {
    suggestions.push({
      type: 'walk',
      title: 'Would you like walk reminders?',
      reason: 'Lower activity or long screen time can raise fatigue and stress.',
      defaults: {
        startTime: '08:00',
        endTime: '20:00',
        frequencyHours: 2
      }
    })
  }

  const breakFrequency = scale(lifestyle.life_6, 5)
  const studyHours = toNumber(stressorSpecific.studies_1, 0)

  if (breakFrequency <= 2.5 || studyHours >= 6 || assessment.burnoutScore >= 60 || toNumber(responses.studyPressure, 0) >= 6) {
    suggestions.push({
      type: 'break',
      title: 'Would you like study break reminders?',
      reason: 'Long sessions and rising burnout respond well to short screen-free breaks.',
      defaults: {
        startTime: '08:00',
        endTime: '22:00',
        frequencyHours: 2
      }
    })
  }

  if (exerciseDays < 3 || fatigueScore >= 6) {
    suggestions.push({
      type: 'exercise',
      title: 'Would you like exercise reminders?',
      reason: 'Light stretching or exercise can help energy, mood, and stress recovery.',
      defaults: {
        startTime: '06:00',
        endTime: '18:00',
        morningEnabled: true,
        eveningEnabled: true
      }
    })
  }

  return suggestions
}

module.exports = buildReminderSuggestions
