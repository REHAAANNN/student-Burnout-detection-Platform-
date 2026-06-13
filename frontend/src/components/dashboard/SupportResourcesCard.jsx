import { Heart, Users, AlertCircle, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'

/**
 * Support Resources Card
 */
export const SupportResourcesCard = () => {
  const resources = [
    {
      id: 1,
      name: 'Campus Counselor',
      description: 'Professional counseling services available on campus',
      icon: Users,
      available: true
    },
    {
      id: 2,
      name: 'Mental Health Resources',
      description: 'Access to mental health support and educational materials',
      icon: Heart,
      available: true
    },
    {
      id: 3,
      name: 'Emergency Support',
      description: 'Immediate help and crisis support available 24/7',
      icon: AlertCircle,
      available: true
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.map((resource) => {
            const Icon = resource.icon

            return (
              <div key={resource.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-soft transition-shadow">
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{resource.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
                  </div>
                  {resource.available && (
                    <a href="#" className="text-primary-600 hover:text-primary-700 flex-shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
