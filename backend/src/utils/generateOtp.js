const crypto = require('crypto')

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(100000, 999999).toString()
  return otp
}

const hashOtp = async (otp) => {
  const bcrypt = require('bcryptjs')
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(otp, salt)
}

const compareOtp = async (otp, hashedOtp) => {
  const bcrypt = require('bcryptjs')
  return await bcrypt.compare(otp, hashedOtp)
}

module.exports = { generateOtp, hashOtp, compareOtp }