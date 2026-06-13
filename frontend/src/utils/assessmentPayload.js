const SCALE_VALUES = {
  Never: 0,
  Rarely: 2.5,
  Sometimes: 5,
  Often: 7.5,
  Always: 10
}

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

const scale = (value, fallback = 0) => {
  if (typeof value === 'number') return value
  return SCALE_VALUES[value] ?? fallback
}

const average = (values, fallback = 0) => {
  const numericValues = values
    .map((value) => toNumber(value, null))
    .filter((value) => value !== null)

  if (numericValues.length === 0) return fallback

  return numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
}

const supportScore = (value, fallback = 5) => {
  if (value === 'Yes' || value === 'Yes, consistently') return 9
  if (value === 'Somewhat' || value === 'Sometimes' || value === 'Yes, sometimes') return 5
  if (value === 'No' || value === 'Not sure') return 2
  return fallback
}

export const buildAssessmentPayload = (answers) => {
  const core = answers.core || {}
  const stressorSpecific = answers.stressorSpecific || {}
  const lifestyle = answers.lifestyle || {}
  const mood = answers.mood || {}

  const responses = {
    energyLevel: toNumber(mood.energyLevel, 5),
    emotionalOverwhelm: toNumber(mood.overwhelmedLevel, 0),
    mentalExhaustion: average([
      mood.mentalExhaustion,
      scale(core.core_1, null),
      scale(core.core_7, null)
    ]),
    studyPressure: average([
      stressorSpecific.studies_2,
      stressorSpecific.studies_4,
      scale(stressorSpecific.studies_5, null),
      scale(core.core_2, null),
      core.core_3
    ]),
    examStress: average([
      stressorSpecific.exams_2,
      scale(stressorSpecific.exams_3, null),
      scale(stressorSpecific.exams_4, null),
      scale(stressorSpecific.exams_5, null)
    ]),
    careerAnxiety: average([
      stressorSpecific.career_1,
      stressorSpecific.career_2,
      stressorSpecific.career_5,
      stressorSpecific.career_6,
      scale(stressorSpecific.career_7, null)
    ]),
    sleepHours: toNumber(stressorSpecific.sleep_1, 8),
    sleepQuality: toNumber(stressorSpecific.sleep_2, 5),
    financialStress: average([
      stressorSpecific.fin_1,
      scale(stressorSpecific.fin_2, null),
      scale(stressorSpecific.fin_4, null),
      scale(stressorSpecific.fin_5, null)
    ]),
    physicalFatigue: average([
      scale(stressorSpecific.phys_1, null),
      scale(stressorSpecific.phys_2, null),
      scale(stressorSpecific.phys_5, null),
      scale(stressorSpecific.phys_6, null)
    ]),
    lonelinessScore: average([
      scale(stressorSpecific.friends_2, null),
      scale(stressorSpecific.friends_6, null),
      scale(stressorSpecific.lone_1, null),
      stressorSpecific.lone_4,
      scale(stressorSpecific.lone_5, null)
    ]),
    timeManagementScore: average([
      stressorSpecific.tm_3,
      stressorSpecific.tm_5,
      stressorSpecific.tm_1 ? 10 - scale(stressorSpecific.tm_1) : null,
      stressorSpecific.tm_7 ? 10 - scale(stressorSpecific.tm_7) : null
    ], 5),
    assignmentsPending: Math.max(
      toNumber(stressorSpecific.studies_3, 0),
      toNumber(stressorSpecific.assign_1, 0)
    ),
    familyPressure: average([
      scale(stressorSpecific.family_1, null),
      scale(stressorSpecific.family_3, null),
      stressorSpecific.family_4,
      scale(stressorSpecific.studies_8, null)
    ]),
    socialSupport: average([
      supportScore(stressorSpecific.family_2),
      supportScore(stressorSpecific.friends_1),
      supportScore(stressorSpecific.lone_2),
      supportScore(stressorSpecific.lone_6),
      scale(lifestyle.life_7, null)
    ], 5)
  }

  return {
    mood: mood.mood,
    stressors: answers.stressors || [],
    responses,
    rawAnswers: answers,
    ventJournal: answers.ventJournal || ''
  }
}
