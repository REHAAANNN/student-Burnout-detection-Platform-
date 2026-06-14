const express = require('express')
const router = express.Router()
const {
  getReminders,
  updateReminder,
  trackReminder
} = require('../controllers/reminderController')

router.get('/:userId', getReminders)
router.put('/:userId/:type', updateReminder)
router.post('/:userId/:type/track', trackReminder)

module.exports = router
