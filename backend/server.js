require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/config/db')
const { configureCloudinary } = require('./src/config/cloudinary')

const PORT = process.env.PORT || 8000

connectDB()
configureCloudinary()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
