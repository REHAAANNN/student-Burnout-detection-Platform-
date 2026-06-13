const express = require('express')
const cors = require('cors')

const assessmentRoutes = require('./routes/assessmentRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const journalRoutes = require('./routes/journalRoutes')
const authRoutes = require('./routes/authRoutes')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend running'
  })
})

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Frontend connected successfully'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/assessment', assessmentRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/journal', journalRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
