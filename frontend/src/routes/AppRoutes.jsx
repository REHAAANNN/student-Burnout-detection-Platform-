import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

// Pages
import { Login } from '../pages/auth/Login.jsx'
import { Register } from '../pages/auth/Register.jsx'
import { VerifyRegisterOtp } from '../pages/auth/VerifyRegisterOtp.jsx'
import { VerifyLoginOtp } from '../pages/auth/VerifyLoginOtp.jsx'
import { AdvancedAssessment } from '../pages/onboarding/AdvancedAssessment.jsx'
import { Dashboard } from '../pages/dashboard/Dashboard.jsx'
import { Journal } from '../pages/journal/Journal.jsx'
import { Recommendations } from '../pages/recommendations/Recommendations.jsx'
import { NotFound } from '../pages/NotFound.jsx'

// Route protection
import { ProtectedRoute, AuthRoute } from './ProtectedRoute.jsx'

// Store
import { useAuthStore } from '../store/authStore.js'
import { useUIStore } from '../store/uiStore.js'

/**
 * App routes configuration
 */
export const AppRoutes = () => {
  const { initAuth } = useAuthStore()
  const { isDarkMode } = useUIStore()

  useEffect(() => {
    // Initialize auth from the backend session.
    initAuth()

    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [initAuth, isDarkMode])

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
        <Route
          path="/verify-register-otp"
          element={
            <AuthRoute>
              <VerifyRegisterOtp />
            </AuthRoute>
          }
        />
        <Route
          path="/verify-login-otp"
          element={
            <AuthRoute>
              <VerifyLoginOtp />
            </AuthRoute>
          }
        />

        {/* Advanced Assessment Route (6-section wizard) */}
        <Route
          path="/onboarding/assessment"
          element={
            <ProtectedRoute>
              <AdvancedAssessment />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Journal Routes */}
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          }
        />

        {/* Recommendations Routes */}
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />

        {/* Home redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}