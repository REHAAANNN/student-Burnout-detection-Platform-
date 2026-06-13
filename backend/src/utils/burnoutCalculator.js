/**
 * Calculate burnout score from assessment responses.
 * Returns a normalized score (0-100) and risk level.
 */
const calculateBurnout = (responses) => {
  const {
    studyPressure = 0,
    examStress = 0,
    careerAnxiety = 0,
    mentalExhaustion = 0,
    sleepHours = 8,
    emotionalOverwhelm = 0,
    financialStress = 0,
    physicalFatigue = 0,
    lonelinessScore = 0,
    timeManagementScore = 0,
    assignmentsPending = 0,
    sleepQuality = 5,
    familyPressure = 0,
    socialSupport = 5,
    energyLevel = 5
  } = responses

  // Calculate score using weighted formula
  const rawScore =
    studyPressure * 2 +
    examStress * 2 +
    careerAnxiety * 1.5 +
    mentalExhaustion * 2 +
    emotionalOverwhelm * 1.5 +
    financialStress * 1.5 +
    physicalFatigue * 2 +
    lonelinessScore * 2 +
    (10 - timeManagementScore) * 1 +
    familyPressure * 1.5 +
    assignmentsPending * 0.5 +
    (10 - sleepQuality) * 1.5 +
    (10 - energyLevel) * 1 +
    (10 - socialSupport) * 1 +
    (10 - Math.min(sleepHours, 10)) * 3

  // Normalize to 0-100 based on the weighted 1-10 response fields.
  const maxPossibleScore = 250
  const burnoutScore = Math.min(Math.round((rawScore / maxPossibleScore) * 100), 100)

  // Determine risk level
  let riskLevel = 'Low'
  if (burnoutScore >= 70) {
    riskLevel = 'High'
  } else if (burnoutScore >= 40) {
    riskLevel = 'Moderate'
  }

  return { burnoutScore, riskLevel }
}

module.exports = calculateBurnout
