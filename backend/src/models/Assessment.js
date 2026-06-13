const mongoose = require('mongoose')

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    default: null
  },
  stressors: [{
    type: String
  }],
  responses: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  numericScores: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  rawAnswers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  calculatedScores: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ventJournal: {
    type: String,
    default: '',
    maxlength: 5000
  },
  burnoutScore: {
    type: Number,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    default: 'Low'
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
})

module.exports = mongoose.model('Assessment', assessmentSchema)
