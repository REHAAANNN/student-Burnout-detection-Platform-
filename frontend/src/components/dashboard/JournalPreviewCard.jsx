import { BookOpen } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { truncateText } from '../../utils'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'

/**
 * Journal Preview Card
 */
export const JournalPreviewCard = ({ entry = null }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Recent Journal Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entry ? (
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {truncateText(entry.content, 150)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              {new Date(entry.date).toLocaleDateString()}
            </p>
            <Link to={ROUTES.JOURNAL}>
              <Button variant="outline" size="sm" className="w-full">
                View All Entries
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 mb-3">No journal entries yet</p>
            <Link to={ROUTES.JOURNAL}>
              <Button variant="primary" size="sm" className="w-full">
                Start Journaling
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
