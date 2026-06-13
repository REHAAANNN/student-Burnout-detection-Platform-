const Journal = require('../models/Journal')

/**
 * Lightweight sentiment analysis based on keywords.
 */
const analyzeSentiment = (text) => {
  const lower = text.toLowerCase()
  const negativeWords = ['stressed', 'anxious', 'tired']

  if (negativeWords.some((word) => lower.includes(word))) return 'negative'
  return 'neutral'
}

// @desc    Create a journal entry
// @route   POST /api/journal
const createEntry = async (req, res, next) => {
  try {
    const { userId, entry } = req.body

    if (!userId || !entry) {
      return res.status(400).json({
        success: false,
        message: 'userId and entry are required'
      })
    }

    const sentiment = analyzeSentiment(entry)

    const journalEntry = await Journal.create({
      userId,
      entry,
      sentiment
    })

    res.status(201).json({
      success: true,
      sentiment,
      data: journalEntry
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all journal entries for a user
// @route   GET /api/journal/:userId
const getEntries = async (req, res, next) => {
  try {
    const entries = await Journal.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: entries.length,
      data: entries
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
const deleteEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findByIdAndDelete(req.params.id)

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      })
    }

    res.json({
      success: true,
      message: 'Journal entry deleted'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { createEntry, getEntries, deleteEntry }
