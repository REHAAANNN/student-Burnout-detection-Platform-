const express = require('express')
const router = express.Router()
const { getStreaks, updateStreaks } = require('../controllers/streakController')

router.get('/:userId', getStreaks)
router.post('/update', updateStreaks)

module.exports = router
