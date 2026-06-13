const nodemailer = require('nodemailer')

const configureSmtp = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  return transporter
}

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = configureSmtp()

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    }

    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${to}`)
    return true
  } catch (error) {
    console.error('Email sending failed:', error.message)
    throw new Error('Failed to send email. Please try again later.')
  }
}

module.exports = { configureSmtp, sendEmail }