const express = require('express')
const router = express.Router()
const {
  registerUser,
  resendRegisterOtp,
  verifyRegisterOtp,
  loginUser,
  resendLoginOtp,
  verifyLoginOtp,
  getProfile
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

// POST /api/auth/register
router.post('/register', registerUser)

// POST /api/auth/resend-register-otp
router.post('/resend-register-otp', resendRegisterOtp)

// POST /api/auth/verify-register-otp
router.post('/verify-register-otp', verifyRegisterOtp)

// POST /api/auth/login
router.post('/login', loginUser)

// POST /api/auth/resend-login-otp
router.post('/resend-login-otp', resendLoginOtp)

// POST /api/auth/verify-login-otp
router.post('/verify-login-otp', verifyLoginOtp)

// GET /api/auth/profile (protected)
router.get('/profile', protect, getProfile)

module.exports = router