import { motion } from 'framer-motion'
import { Award, Droplets, Dumbbell, Flame, Footprints } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

const STREAK_ITEMS = [
  { key: 'wellnessStreak', label: 'Wellness', icon: Flame, color: 'text-danger-600', bg: 'bg-danger-50 dark:bg-danger-900/20' },
  { key: 'waterStreak', label: 'Water', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'walkStreak', label: 'Walk', icon: Footprints, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { key: 'exerciseStreak', label: 'Exercise', icon: Dumbbell, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' }
]

const badgeFor = (days) => {
  if (days >= 30) return 'Gold'
  if (days >= 7) return 'Silver'
  if (days >= 3) return 'Bronze'
  return 'Starter'
}

export const StreaksCard = ({ streaks = {} }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Streaks</CardTitle>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Consistency rewards for healthy habits</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STREAK_ITEMS.map((item, index) => {
            const Icon = item.icon
            const days = streaks[item.key] || 0
            const badge = badgeFor(days)

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.bg}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
                    <Award className="h-3 w-3" />
                    {badge}
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-600 dark:text-gray-400">{item.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-950 dark:text-white">{days} days</p>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
