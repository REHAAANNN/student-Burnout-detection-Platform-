const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['water', 'walk', 'break', 'exercise'],
    required: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: String,
    default: '06:00'
  },
  endTime: {
    type: String,
    default: '22:00'
  },
  frequencyHours: {
    type: Number,
    default: 2
  },
  dailyGoal: {
    type: Number,
    default: 8
  },
  completedToday: {
    type: Number,
    default: 0
  },
  lastTrackedDate: {
    type: String,
    default: ''
  },
  morningEnabled: {
    type: Boolean,
    default: true
  },
  eveningEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

reminderSchema.index({ userId: 1, type: 1 }, { unique: true })

module.exports = mongoose.model('WellnessReminder', reminderSchema)
