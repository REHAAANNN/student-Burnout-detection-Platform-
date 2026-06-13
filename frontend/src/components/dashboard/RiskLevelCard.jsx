import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'

/**
 * Risk Level Card
 */
export const RiskLevelCard = ({ riskLevel = 'High Risk' }) => {
  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'Low Risk':
        return <CheckCircle className="w-8 h-8 text-success-600" />
      case 'Moderate Risk':
        return <AlertCircle className="w-8 h-8 text-warning-600" />
      case 'High Risk':
        return <AlertTriangle className="w-8 h-8 text-danger-600" />
      default:
        return <AlertCircle className="w-8 h-8 text-primary-600" />
    }
  }

  const getRiskBadgeVariant = () => {
    switch (riskLevel) {
      case 'Low Risk':
        return 'success'
      case 'Moderate Risk':
        return 'warning'
      case 'High Risk':
        return 'danger'
      default:
        return 'primary'
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="text-center">
          <div className="flex justify-center mb-3">{getRiskIcon()}</div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Risk Level</h3>
          <Badge variant={getRiskBadgeVariant()} className="text-center justify-center w-full">
            {riskLevel}
          </Badge>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            {riskLevel === 'Low Risk' && 'You are managing well. Keep it up!'}
            {riskLevel === 'Moderate Risk' && 'Take action to reduce stress levels.'}
            {riskLevel === 'High Risk' && 'Consider seeking support immediately.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
