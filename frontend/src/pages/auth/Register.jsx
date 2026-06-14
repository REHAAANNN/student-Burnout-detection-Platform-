import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { ErrorMessage, SuccessMessage } from '../../components/common/ErrorMessage'
import { useAuth } from '../../context/AuthContext'
import { useForm } from '../../hooks/useForm'
import { isValidEmail, validatePassword } from '../../utils'
import { ROUTES } from '../../constants'

/**
 * Register page
 */
export const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { register, error: authError, clearError } = useAuth()

  const { values, errors, isSubmitting, handleChange, handleSubmit, setFieldError } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    async (values) => {
      // Clear previous error
      clearError()
      setSuccessMessage('')

      // Validation
      if (!values.name || !values.email || !values.password || !values.confirmPassword) {
        throw new Error('Please fill in all fields')
      }

      if (!isValidEmail(values.email)) {
        setFieldError('email', 'Invalid email format')
        throw new Error('Invalid email')
      }

      const passwordValidation = validatePassword(values.password)
      if (!passwordValidation.isValid) {
        setFieldError('password', 'Password must be 8+ chars with uppercase, lowercase, and numbers')
        throw new Error('Password requirements not met')
      }

      if (values.password !== values.confirmPassword) {
        setFieldError('confirmPassword', 'Passwords do not match')
        throw new Error('Passwords do not match')
      }

      // Register - sends OTP to email
      await register(values.name, values.email, values.password)
      setSuccessMessage('OTP sent to your email! Redirecting to verification...')
      
      // Redirect to OTP verification page
      setTimeout(() => {
        navigate(ROUTES.VERIFY_REGISTER_OTP, { state: { email: values.email } })
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
          <p className="text-gray-600 dark:text-gray-400">Join Our Wellness Community</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg-soft">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Start your wellness journey today</p>

          {authError && <ErrorMessage message={authError} className="mb-6" />}
          {successMessage && <SuccessMessage message={successMessage} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              icon={User}
              placeholder="John Doe"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              icon={Mail}
              placeholder="your.email@example.com"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                icon={Lock}
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 z-10 rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                icon={Lock}
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 z-10 rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Password must be 8+ characters with uppercase, lowercase, and numbers
            </p>

            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
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
