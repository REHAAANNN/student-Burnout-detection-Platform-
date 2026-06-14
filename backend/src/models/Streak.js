const mongoose = require('mongoose')

const streakSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  wellnessStreak: {
    type: Number,
    default: 0
  },
  waterStreak: {
    type: Number,
    default: 0
  },
  walkStreak: {
    type: Number,
    default: 0
  },
  exerciseStreak: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: null
  },
  lastWellnessDate: {
    type: String,
    default: ''
  },
  lastWaterDate: {
    type: String,
    default: ''
  },
  lastWalkDate: {
    type: String,
    default: ''
  },
  lastExerciseDate: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Streak', streakSchema)
