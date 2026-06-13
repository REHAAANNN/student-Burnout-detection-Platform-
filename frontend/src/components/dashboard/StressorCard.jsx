import { Card, CardContent } from '../ui/Card'

/**
 * Stressor Card
 */
export const StressorCard = ({ mainStressor = 'Studies' }) => {
  const stressorIcons = {
    studies: '📚',
    exams: '📝',
    assignments: '✏️',
    sleep: '😴',
    family: '👨‍👩‍👧',
    friends: '👥',
    relationship: '💑',
    career: '💼',
    financial: '💰',
    health: '🏥',
    other: '❓'
  }

  const stressorId = mainStressor.toLowerCase().replace(/\s+/g, '_')
  const icon = stressorIcons[stressorId] || '❓'

  return (
    <Card>
      <CardContent>
        <h3 className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">Main Stressor</h3>
        <div className="text-center">
          <div className="text-5xl mb-3">{icon}</div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{mainStressor}</p>
        </div>
      </CardContent>
    </Card>
  )
}
