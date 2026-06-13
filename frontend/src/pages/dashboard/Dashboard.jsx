import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, Sparkles, RefreshCw } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Loader } from '../../components/common/Loader'
import { ErrorMessage } from '../../components/common/ErrorMessage'
import { Button } from '../../components/ui/Button'
import { BurnoutScoreCard } from '../../components/dashboard/BurnoutScoreCard'
import { RiskLevelCard } from '../../components/dashboard/RiskLevelCard'
import { MoodCard } from '../../components/dashboard/MoodCard'
import { StressorCard } from '../../components/dashboard/StressorCard'
import { TrendChart } from '../../components/dashboard/TrendChart'
import { RecommendationsCard } from '../../components/dashboard/RecommendationsCard'
import { BurnoutDriversCard } from '../../components/dashboard/BurnoutDriversCard'
import { JournalPreviewCard } from '../../components/dashboard/JournalPreviewCard'
import { SupportResourcesCard } from '../../components/dashboard/SupportResourcesCard'
import { dashboardService } from '../../services/dashboardService'
import { useAssessmentStore } from '../../store/assessmentStore'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../constants'

/**
 * Dashboard page - Main analytics dashboard
 */
export const Dashboard = () => {
  const navigate = useNavigate()
  const assessmentStore = useAssessmentStore()
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchData = async () => {
      try {
        setIsLoading(true)

        const userId = user?._id
        if (!userId) return

        const [data, trendData] = await Promise.all([
          dashboardService.getDashboardData(userId),
          dashboardService.getBurnoutTrend(userId)
        ])
        setDashboardData({
          ...data,
          trendData
        })
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's your wellness overview</p>
        </div>

        {error && <ErrorMessage message={error} />}

        {dashboardData && (
          <>
            {/* Assessment CTA */}
            <div className="overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-r from-success-50 via-white to-accent-50 p-6 shadow-lg-soft dark:border-gray-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-soft">
                    <ClipboardCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-success-600" />
                      <span className="text-sm font-semibold uppercase tracking-wide text-success-700 dark:text-success-300">
                        Mood check-in
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                      Take the assessment test to understand your mood
                    </h2>
                    <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
                      Answer a few calm, personalized questions and refresh your burnout snapshot.
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full flex-shrink-0 lg:w-auto"
                  onClick={() => {
                    assessmentStore.reset()
                    navigate(ROUTES.ONBOARDING_ASSESSMENT)
                  }}
                >
                  Take Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <BurnoutScoreCard score={dashboardData.burnoutScore} />
              <RiskLevelCard riskLevel={dashboardData.riskLevel} />
              <MoodCard mood={dashboardData.moodToday} />
              <StressorCard mainStressor={dashboardData.mainStressor} />
            </div>

            {/* Trend Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrendChart data={dashboardData.trendData} />
              </div>
              <div>
                <RecommendationsCard recommendations={dashboardData.recommendations} />
              </div>
            </div>

            {/* Drivers and Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BurnoutDriversCard data={dashboardData.stressorBreakdown} />
              <SupportResourcesCard />
            </div>

            {/* Journal and Footer */}
            <JournalPreviewCard entry={dashboardData.recentJournal} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
