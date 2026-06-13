const mongoose = require('mongoose')

const journalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  entry: {
    type: String,
    required: [true, 'Journal entry is required'],
    maxlength: 5000
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
})

module.exports = mongoose.model('Journal', journalSchema)
