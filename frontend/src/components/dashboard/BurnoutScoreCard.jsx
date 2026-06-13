import { TrendingUp } from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { getRiskColorClass } from '../../utils'

/**
 * Burnout Score Card
 */
export const BurnoutScoreCard = ({ score = 72 }) => {
  const percentage = Math.min(score, 100)

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-600 dark:text-gray-400 font-medium">Burnout Score</h3>
          <TrendingUp className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex items-end gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(percentage / 100) * 282.7} 282.7`}
                className={percentage < 40 ? 'text-success-600' : percentage < 70 ? 'text-warning-600' : 'text-danger-600'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{score}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Status</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Updated today</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
