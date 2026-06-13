const express = require('express')
const router = express.Router()
const { submitAssessment, getLatestAssessment } = require('../controllers/assessmentController')

// POST /api/assessment
router.post('/', submitAssessment)

// GET /api/assessment/:userId
router.get('/:userId', getLatestAssessment)

module.exports = router