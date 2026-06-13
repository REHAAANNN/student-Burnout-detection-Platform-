import { useEffect, useState } from 'react'
import { Lightbulb, BookOpen, Moon, Activity } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Loader } from '../../components/common/Loader'
import { dashboardService } from '../../services/dashboardService'
import { useAuthStore } from '../../store/authStore'

/**
 * Recommendations page
 */
export const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true)
        const dashboardData = await dashboardService.getDashboardData(user?.id || user?._id)
        setRecommendations((dashboardData.recommendations || []).map((text, index) => ({
          id: index + 1,
          title: text,
          description: text,
          category: inferCategory(text),
          impact: dashboardData.riskLevel === 'High Risk' ? 'Critical' : index === 0 ? 'High' : 'Medium'
        })))
      } catch (error) {
        console.error('Failed to load recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [user])

  const getCategoryIcon = (category) => {
    const icons = {
      'Study Habits': BookOpen,
      'Sleep': Moon,
      'Wellness': Activity,
      'Mental Health': Lightbulb,
      'All': Lightbulb
    }
    return icons[category] || Lightbulb
  }

  const categories = [...new Set(recommendations.map((r) => r.category))]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Personalized Recommendations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Actionable wellness tips tailored to your needs
          </p>
        </div>

        {/* Categories */}
        {categories.map((category) => {
          const categoryRecommendations = recommendations.filter((r) => r.category === category)
          const Icon = getCategoryIcon(category)

          return (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {categoryRecommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md-soft transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {rec.title}
                        </h3>
                        <Badge variant={rec.impact === 'Critical' ? 'danger' : rec.impact === 'High' ? 'warning' : 'primary'}>
                          {rec.impact}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {rec.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        {/* General Tips */}
        <Card className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-primary-200 dark:border-primary-800">
          <CardHeader>
            <CardTitle>💡 Pro Tips for Success</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-primary-600 font-bold">1.</span>
                <span>Start with one recommendation and build from there. Small changes lead to big results.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-600 font-bold">2.</span>
                <span>Track your progress in the journal. Reflect on what's working for you.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-600 font-bold">3.</span>
                <span>Be consistent. Wellness is a journey, not a destination.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-600 font-bold">4.</span>
                <span>Don't hesitate to seek support. It's a sign of strength, not weakness.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

const inferCategory = (text) => {
  const value = text.toLowerCase()
  if (value.includes('sleep')) return 'Sleep'
  if (value.includes('study') || value.includes('break')) return 'Study Habits'
  if (value.includes('counsel') || value.includes('mindfulness') || value.includes('breathing')) return 'Mental Health'
  return 'Wellness'
}
