const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const { generateOtp, hashOtp, compareOtp } = require('../utils/generateOtp')
const { sendOtpEmail } = require('../utils/sendEmail')

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Generate 6-digit OTP
    const otp = generateOtp()
    const hashedOtp = await hashOtp(otp)

    // Calculate OTP expiry
    const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRES_IN_MINUTES, 10) || 10
    const otpExpiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000)

    // Create user (password will be hashed by mongoose pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
      otp: hashedOtp,
      otpExpiresAt
    })

    // Log OTP in development mode for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n========== REGISTER OTP ==========`)
      console.log(`Email: ${email}`)
      console.log(`OTP: ${otp}`)
      console.log(`Expires: ${otpExpiresAt}`)
      console.log(`==================================\n`)
    }

    // Send OTP to email - wrap in try-catch so registration still works if email fails
    try {
      await sendOtpEmail({
        email: user.email,
        otp,
        purpose: 'register'
      })
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message)
    }

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      data: {
        email: user.email
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Resend register OTP
// @route   POST /api/auth/resend-register-otp
const resendRegisterOtp = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      })
    }

    // Generate new OTP
    const otp = generateOtp()
    const hashedOtp = await hashOtp(otp)
    const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRES_IN_MINUTES, 10) || 10
    const otpExpiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000)

    user.otp = hashedOtp
    user.otpExpiresAt = otpExpiresAt
    await user.save()

    if (process.env.NODE_ENV === 'development') {
      console.log(`\n========== RESEND OTP ==========`)
      console.log(`Email: ${email}`)
      console.log(`OTP: ${otp}`)
      console.log(`Expires: ${otpExpiresAt}`)
      console.log(`================================\n`)
    }

    try {
      await sendOtpEmail({ email: user.email, otp, purpose: 'register' })
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message)
    }

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email',
      data: { email: user.email }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify register OTP
// @route   POST /api/auth/verify-register-otp
const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    // Validate required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      })
    }

    // Check OTP exists
    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please register again.'
      })
    }

    // Check OTP expiry
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      })
    }

    // Compare OTP with hashed OTP
    const isValidOtp = await compareOtp(otp, user.otp)
    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      })
    }

    // Mark user as verified and clear OTP fields
    user.isEmailVerified = true
    user.otp = null
    user.otpExpiresAt = null
    await user.save()

    // Generate JWT token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Check user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first. Check your inbox for the OTP.'
      })
    }

    // Generate new 6-digit OTP
    const otp = generateOtp()
    const hashedOtp = await hashOtp(otp)

    // Calculate OTP expiry
    const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRES_IN_MINUTES, 10) || 10
    const otpExpiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000)

    // Store OTP and OTP expiry
    user.otp = hashedOtp
    user.otpExpiresAt = otpExpiresAt
    await user.save()

    // Log OTP in development mode for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n========== LOGIN OTP ==========`)
      console.log(`Email: ${email}`)
      console.log(`OTP: ${otp}`)
      console.log(`Expires: ${otpExpiresAt}`)
      console.log(`================================\n`)
    }

    // Send OTP to email - wrap in try-catch so login still works if email fails
    try {
      await sendOtpEmail({
        email: user.email,
        otp,
        purpose: 'login'
      })
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message)
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to login.',
      data: {
        email: user.email
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Resend login OTP
// @route   POST /api/auth/resend-login-otp
const resendLoginOtp = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Generate new OTP
    const otp = generateOtp()
    const hashedOtp = await hashOtp(otp)
    const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRES_IN_MINUTES, 10) || 10
    const otpExpiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000)

    user.otp = hashedOtp
    user.otpExpiresAt = otpExpiresAt
    await user.save()

    if (process.env.NODE_ENV === 'development') {
      console.log(`\n========== RESEND LOGIN OTP ==========`)
      console.log(`Email: ${email}`)
      console.log(`OTP: ${otp}`)
      console.log(`Expires: ${otpExpiresAt}`)
      console.log(`=====================================\n`)
    }

    try {
      await sendOtpEmail({ email: user.email, otp, purpose: 'login' })
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message)
    }

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email',
      data: { email: user.email }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify login OTP
// @route   POST /api/auth/verify-login-otp
const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    // Validate required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check OTP exists
    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please login again.'
      })
    }

    // Check OTP expiry
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      })
    }

    // Compare OTP with hashed OTP
    const isValidOtp = await compareOtp(otp, user.otp)
    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      })
    }

    // Clear OTP fields
    user.otp = null
    user.otpExpiresAt = null
    await user.save()

    // Generate JWT token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = req.user

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  registerUser,
  resendRegisterOtp,
  verifyRegisterOtp,
  loginUser,
  resendLoginOtp,
  verifyLoginOtp,
  getProfile
}