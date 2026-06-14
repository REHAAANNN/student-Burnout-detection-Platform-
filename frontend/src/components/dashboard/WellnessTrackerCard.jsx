import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Bell,
  BellOff,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Footprints,
  PauseCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { reminderService } from '../../services/reminderService'

const CONFIG = {
  water: {
    label: 'Water',
    icon: Droplets,
    message: 'Time to drink water 💧',
    accent: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  walk: {
    label: 'Walk',
    icon: Footprints,
    message: 'Take a short walk 🚶',
    accent: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  break: {
    label: 'Break',
    icon: PauseCircle,
    message: 'Take a 10-minute break away from screen 🌿',
    accent: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20'
  },
  exercise: {
    label: 'Exercise',
    icon: Dumbbell,
    message: 'Time to stretch or exercise 🏃',
    accent: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20'
  }
}

const DEFAULTS = {
  water: { type: 'water', enabled: false, startTime: '06:00', endTime: '22:00', frequencyHours: 2, dailyGoal: 8, completedToday: 0 },
  walk: { type: 'walk', enabled: false, startTime: '08:00', endTime: '20:00', frequencyHours: 2, dailyGoal: 1, completedToday: 0 },
  break: { type: 'break', enabled: false, startTime: '08:00', endTime: '22:00', frequencyHours: 2, dailyGoal: 4, completedToday: 0 },
  exercise: { type: 'exercise', enabled: false, startTime: '06:00', endTime: '18:00', frequencyHours: 12, dailyGoal: 1, completedToday: 0, morningEnabled: true, eveningEnabled: true }
}

const toMinutes = (time) => {
  const [hours, minutes] = String(time || '00:00').split(':').map(Number)
  return (hours * 60) + (minutes || 0)
}

const notificationKey = (type, date, hour) => `burnout_guard_notification_${type}_${date}_${hour}`

const canNotifyNow = (reminder, now) => {
  if (!reminder.enabled) return false

  const minutesNow = (now.getHours() * 60) + now.getMinutes()
  const start = toMinutes(reminder.startTime)
  const end = toMinutes(reminder.endTime)

  if (minutesNow < start || minutesNow > end || now.getMinutes() !== 0) return false

  if (reminder.type === 'exercise') {
    return (reminder.morningEnabled && now.getHours() === 6) || (reminder.eveningEnabled && now.getHours() === 18)
  }

  const elapsedHours = Math.floor((minutesNow - start) / 60)
  return elapsedHours % Number(reminder.frequencyHours || 2) === 0
}

const ReminderToggle = ({ reminder, onUpdate }) => {
  const config = CONFIG[reminder.type]
  const Icon = config.icon

  const handleToggle = async () => {
    if (!reminder.enabled && 'Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
    onUpdate(reminder.type, { enabled: !reminder.enabled })
  }

  return (
    <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
            <Icon className={`h-5 w-5 ${config.accent}`} />
          </span>
          <div>
            <p className="font-semibold text-gray-950 dark:text-white">{config.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {reminder.enabled ? 'Reminder enabled' : 'Reminder disabled'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`inline-flex h-8 w-14 items-center rounded-full p-1 transition-colors ${
            reminder.enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'
          }`}
          aria-label={`${reminder.enabled ? 'Disable' : 'Enable'} ${config.label} reminder`}
        >
          <span
            className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
              reminder.enabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {reminder.type === 'water' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            Start time
            <input type="time" value={reminder.startTime} onChange={(event) => onUpdate('water', { startTime: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </label>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            End time
            <input type="time" value={reminder.endTime} onChange={(event) => onUpdate('water', { endTime: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </label>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            Frequency
            <select value={reminder.frequencyHours} onChange={(event) => onUpdate('water', { frequencyHours: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value={1}>1h</option>
              <option value={2}>2h</option>
              <option value={3}>3h</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            Daily goal
            <select value={reminder.dailyGoal} onChange={(event) => onUpdate('water', { dailyGoal: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value={6}>6 glasses</option>
              <option value={8}>8 glasses</option>
              <option value={10}>10 glasses</option>
            </select>
          </label>
        </div>
      )}

      {(reminder.type === 'walk' || reminder.type === 'break') && (
        <label className="mt-4 block text-xs font-semibold text-gray-600 dark:text-gray-300">
          Frequency
          <select value={reminder.frequencyHours} onChange={(event) => onUpdate(reminder.type, { frequencyHours: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <option value={2}>Every 2h</option>
            <option value={3}>Every 3h</option>
            <option value={4}>Every 4h</option>
          </select>
        </label>
      )}

      {reminder.type === 'exercise' && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={reminder.morningEnabled} onChange={(event) => onUpdate('exercise', { morningEnabled: event.target.checked })} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            Morning 6 AM
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={reminder.eveningEnabled} onChange={(event) => onUpdate('exercise', { eveningEnabled: event.target.checked })} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            Evening 6 PM
          </label>
        </div>
      )}
    </div>
  )
}

export const WellnessTrackerCard = ({ userId, initialReminders = [], suggestions = [], onActivityTracked }) => {
  const [reminders, setReminders] = useState(() => ({
    ...DEFAULTS,
    ...initialReminders.reduce((result, reminder) => {
      result[reminder.type] = { ...DEFAULTS[reminder.type], ...reminder }
      return result
    }, {})
  }))

  useEffect(() => {
    let mounted = true

    const loadReminders = async () => {
      try {
        const data = await reminderService.getReminders(userId)
        if (!mounted) return
        setReminders((current) => ({
          ...current,
          ...data.reduce((result, reminder) => {
            result[reminder.type] = { ...current[reminder.type], ...reminder }
            return result
          }, {})
        }))
      } catch (error) {
        toast.error(error.message)
      }
    }

    if (userId) loadReminders()

    return () => {
      mounted = false
    }
  }, [userId])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return

      const now = new Date()
      const date = now.toISOString().slice(0, 10)

      Object.values(reminders).forEach((reminder) => {
        if (!canNotifyNow(reminder, now)) return

        const key = notificationKey(reminder.type, date, now.getHours())
        if (localStorage.getItem(key)) return

        localStorage.setItem(key, 'sent')
        new Notification(CONFIG[reminder.type].message)
      })
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [reminders])

  const suggestedTypes = useMemo(() => suggestions.map((item) => item.type), [suggestions])
  const water = reminders.water
  const waterPct = Math.min(100, Math.round(((water.completedToday || 0) / (water.dailyGoal || 8)) * 100))

  const updateReminder = async (type, updates) => {
    const previous = reminders[type]
    const next = { ...previous, ...updates }
    setReminders((current) => ({ ...current, [type]: next }))

    try {
      const saved = await reminderService.updateReminder(userId, type, updates)
      setReminders((current) => ({ ...current, [type]: { ...current[type], ...saved } }))
    } catch (error) {
      setReminders((current) => ({ ...current, [type]: previous }))
      toast.error(error.message)
    }
  }

  const track = async (type) => {
    const previous = reminders[type]
    setReminders((current) => ({
      ...current,
      [type]: {
        ...current[type],
        completedToday: (current[type].completedToday || 0) + 1
      }
    }))

    try {
      const saved = await reminderService.trackReminder(userId, type)
      setReminders((current) => ({ ...current, [type]: { ...current[type], ...saved } }))
      onActivityTracked?.(type)
    } catch (error) {
      setReminders((current) => ({ ...current, [type]: previous }))
      toast.error(error.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Wellness Tracker</CardTitle>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Daily habits and personalized reminders</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
            {Object.values(reminders).some((reminder) => reminder.enabled) ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
            {Object.values(reminders).filter((reminder) => reminder.enabled).length} on
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length > 0 && (
          <div className="mb-5 rounded-xl border border-primary-100 bg-primary-50 p-4 dark:border-primary-900/40 dark:bg-primary-900/20">
            <p className="mb-3 text-sm font-bold text-primary-800 dark:text-primary-100">Suggested from your assessment</p>
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div key={suggestion.type} className="flex flex-col gap-2 rounded-lg bg-white p-3 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-950 dark:text-white">{suggestion.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{suggestion.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={() => updateReminder(suggestion.type, { ...suggestion.defaults, enabled: true })}>Enable</Button>
                    <Button size="sm" variant="ghost" onClick={() => updateReminder(suggestion.type, { enabled: false })}>Disable</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20 sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Water progress</p>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-200">{water.completedToday || 0}/{water.dailyGoal || 8} glasses</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950">
              <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${waterPct}%` }} />
            </div>
            <Button size="sm" variant="outline" className="mt-3 w-full border-blue-600 text-blue-700 hover:bg-blue-100" onClick={() => track('water')}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Add glass
            </Button>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <p className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">Steps today</p>
            <p className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-100">0</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
            <p className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-300">Breaks taken</p>
            <button type="button" onClick={() => track('break')} className="mt-2 text-left text-2xl font-bold text-amber-900 dark:text-amber-100">
              {reminders.break.completedToday || 0}
            </button>
          </div>
          <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/20 sm:col-span-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-indigo-700 dark:text-indigo-300">Exercise completed</p>
                <p className="mt-1 text-sm font-medium text-indigo-900 dark:text-indigo-100">
                  {(reminders.exercise.completedToday || 0) > 0 ? 'Completed today' : 'Not marked today'}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => track('exercise')}>Mark exercise</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {Object.values(reminders).map((reminder) => (
            <ReminderToggle
              key={reminder.type}
              reminder={{
                ...reminder,
                enabled: reminder.enabled || suggestedTypes.includes(reminder.type) ? reminder.enabled : reminder.enabled
              }}
              onUpdate={updateReminder}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
