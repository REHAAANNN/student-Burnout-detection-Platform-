import { Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'

/**
 * Recommendations Card
 */
export const RecommendationsCard = ({ recommendations = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning-600" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.slice(0, 4).map((rec, idx) => (
              <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-soft transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{rec}</p>
                  <span className="text-xl flex-shrink-0">✓</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No recommendations yet</p>
        )}
      </CardContent>
    </Card>
  )
}
