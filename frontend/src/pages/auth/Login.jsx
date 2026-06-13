import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { ErrorMessage, SuccessMessage } from '../../components/common/ErrorMessage'
import { useAuth } from '../../context/AuthContext'
import { useForm } from '../../hooks/useForm'
import { isValidEmail } from '../../utils'
import { ROUTES } from '../../constants'

/**
 * Login page
 */
export const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { login, error: authError, clearError } = useAuth()

  const { values, errors, isSubmitting, handleChange, handleSubmit, setFieldError } = useForm(
    { email: '', password: '' },
    async (values) => {
      // Clear previous error
      clearError()
      setSuccessMessage('')

      // Validation
      if (!values.email || !values.password) {
        setFieldError('email', 'Email is required')
        setFieldError('password', 'Password is required')
        throw new Error('Please fill in all fields')
      }

      if (!isValidEmail(values.email)) {
        setFieldError('email', 'Invalid email format')
        throw new Error('Invalid email')
      }

      if (values.password.length < 6) {
        setFieldError('password', 'Password must be at least 6 characters')
        throw new Error('Password too short')
      }

      // Login - sends OTP to email (does NOT return JWT directly)
      await login(values.email, values.password)
      setSuccessMessage('OTP sent to your email! Redirecting to verification...')

      // Redirect to login OTP verification page
      setTimeout(() => {
        navigate(ROUTES.VERIFY_LOGIN_OTP, { state: { email: values.email } })
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
          <p className="text-gray-600 dark:text-gray-400">Student Wellness Platform</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg-soft">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Sign in to access your wellness dashboard</p>

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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to={ROUTES.REGISTER} className="text-primary-600 hover:text-primary-700 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}