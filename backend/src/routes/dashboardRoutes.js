const express = require('express')
const router = express.Router()
const { getDashboardData, getTrendData } = require('../controllers/dashboardController')

router.get('/trends/:userId', getTrendData)
router.get('/:userId', getDashboardData)

module.exports = router
