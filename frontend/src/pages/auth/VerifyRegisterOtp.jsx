import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail, Shield } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { ErrorMessage, SuccessMessage } from '../../components/common/ErrorMessage'
import { useAuth } from '../../context/AuthContext'
import { useForm } from '../../hooks/useForm'
import { ROUTES } from '../../constants'

/**
 * Verify Register OTP page
 */
export const VerifyRegisterOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [successMessage, setSuccessMessage] = useState('')
  const emailFromState = location.state?.email || ''

  const { verifyRegisterOtp, error: authError, clearError } = useAuth()

  const { values, errors, isSubmitting, handleChange, handleSubmit, setFieldError } = useForm(
    { email: emailFromState, otp: '' },
    async (values) => {
      // Clear previous error
      clearError()
      setSuccessMessage('')

      // Validation
      if (!values.email || !values.otp) {
        throw new Error('Please provide email and OTP')
      }

      if (values.otp.length !== 6 || !/^\d{6}$/.test(values.otp)) {
        setFieldError('otp', 'OTP must be 6 digits')
        throw new Error('Invalid OTP format')
      }

      // Verify OTP
      await verifyRegisterOtp(values.email, values.otp)
      setSuccessMessage('Email verified successfully! Redirecting to dashboard...')

      // Redirect to dashboard
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD)
      }, 1500)
    }
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-lg mb-4">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Burnout Guard</h1>
          <p className="text-gray-600 dark:text-gray-400">Verify Your Email</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg-soft">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Email</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Enter the 6-digit OTP sent to your email
            </p>
          </div>

          {authError && <ErrorMessage message={authError} className="mb-6" />}
          {successMessage && <SuccessMessage message={successMessage} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              icon={Mail}
              placeholder="your.email@example.com"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              disabled={!!emailFromState}
            />

            <Input
              label="OTP Code"
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={values.otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                handleChange({ target: { name: 'otp', value } })
              }}
              error={errors.otp}
              maxLength={6}
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
              Verify Email
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already verified?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}