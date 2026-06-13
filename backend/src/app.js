const express = require('express')
const cors = require('cors')

const assessmentRoutes = require('./routes/assessmentRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const journalRoutes = require('./routes/journalRoutes')
const authRoutes = require('./routes/authRoutes')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const app = express()

const defaultAllowedOrigins = ['http://localhost:5173']
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    const origins = allowedOrigins.length ? allowedOrigins : defaultAllowedOrigins

    if (!origin || origins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS blocked origin: ${origin}`))
  },
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
