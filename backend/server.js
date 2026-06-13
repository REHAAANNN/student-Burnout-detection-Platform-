require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/config/db')
const { configureCloudinary } = require('./src/config/cloudinary')

// Connect to database
connectDB()
configureCloudinary()

// Export for Vercel serverless
module.exports = app

// Start server only for local development
const PORT = process.env.PORT || 5000

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}