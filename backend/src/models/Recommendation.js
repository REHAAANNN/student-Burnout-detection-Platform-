const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  recommendations: [{
    type: String
  }]
}, {
  timestamps: { createdAt: true, updatedAt: false }
})

module.exports = mongoose.model('Recommendation', recommendationSchema)
