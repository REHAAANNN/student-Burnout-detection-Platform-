const { sendEmail } = require('../config/smtp')

const APP_NAME = process.env.APP_NAME || 'Auth App'

const sendOtpEmail = async ({ email, otp, purpose }) => {
  const subject = purpose === 'register'
    ? `Welcome to ${APP_NAME} - Verify Your Email`
    : `Login OTP for ${APP_NAME}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .body { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp-box { background: white; border: 2px dashed #6366f1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 36px; font-weight: bold; color: #6366f1; letter-spacing: 8px; margin: 10px 0; }
        .footer { text-align: center; padding-top: 20px; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${APP_NAME}</h1>
        </div>
        <div class="body">
          <h2>${purpose === 'register' ? 'Welcome!' : 'Login Request'}</h2>
          <p>Hello,</p>
          <p>${
            purpose === 'register'
              ? 'Thank you for registering. Please use the following OTP to verify your email address.'
              : 'You have requested to login. Please use the following OTP to complete your login.'
          }</p>
          <div class="otp-box">
            <p style="margin:0; color:#666;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin:0; color:#666; font-size:14px;">This OTP expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes</p>
          </div>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({ to: email, subject, html })
}

module.exports = { sendOtpEmail }