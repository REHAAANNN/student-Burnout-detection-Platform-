import { Card, CardContent } from '../ui/Card'

/**
 * Mood Card
 */
export const MoodCard = ({ mood = 'Stressed' }) => {
  const moodEmojis = {
    great: '😄',
    good: '😊',
    okay: '😐',
    stressed: '😰',
    exhausted: '😫'
  }

  const moodId = mood.toLowerCase().replace(' ', '_')
  const emoji = moodEmojis[moodId] || '😐'

  return (
    <Card>
      <CardContent>
        <h3 className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">Mood Today</h3>
        <div className="text-center">
          <div className="text-5xl mb-3">{emoji}</div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{mood}</p>
        </div>
      </CardContent>
    </Card>
  )
}
