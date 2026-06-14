const express = require('express')
const router = express.Router()
const { getDashboardData, getTrendData, getBurnoutForecast } = require('../controllers/dashboardController')

router.get('/forecast/:userId', getBurnoutForecast)
router.get('/trends/:userId', getTrendData)
router.get('/:userId', getDashboardData)

module.exports = router
