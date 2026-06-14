import { AlertTriangle, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

const TREND_STYLES = {
  Rising: {
    color: 'text-danger-700 dark:text-danger-300',
    bg: 'bg-danger-50 dark:bg-danger-900/20',
    border: 'border-danger-200 dark:border-danger-900/50',
    stroke: '#dc2626',
    icon: TrendingUp
  },
  Stable: {
    color: 'text-warning-700 dark:text-warning-300',
    bg: 'bg-warning-50 dark:bg-warning-900/20',
    border: 'border-warning-200 dark:border-warning-900/50',
    stroke: '#d97706',
    icon: Minus
  },
  Improving: {
    color: 'text-success-700 dark:text-success-300',
    bg: 'bg-success-50 dark:bg-success-900/20',
    border: 'border-success-200 dark:border-success-900/50',
    stroke: '#059669',
    icon: TrendingDown
  }
}

export const BurnoutForecastCard = ({ forecast }) => {
  const data = [
    { label: 'Current', score: forecast?.currentBurnout || 0 },
    { label: '7 Days', score: forecast?.predictedBurnout || 0 }
  ]
  const style = TREND_STYLES[forecast?.trend] || TREND_STYLES.Stable
  const Icon = style.icon
  const changeLabel = forecast?.change > 0 ? `+${forecast.change}%` : `${forecast?.change || 0}%`

  return (
    <Card className={`border ${style.border}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Burnout Forecast</CardTitle>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Predicted direction for the next 7 days</p>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${style.bg} ${style.color}`}>
            <Icon className="h-3.5 w-3.5" />
            {forecast?.trend || 'Stable'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 md:grid-cols-[1fr_160px] md:items-center">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Predicted burnout in 7 days</p>
            <div className="mt-2 flex items-end gap-3">
              <p className="text-4xl font-bold text-gray-950 dark:text-white">{forecast?.predictedBurnout || 0}%</p>
              <p className={`pb-1 text-lg font-bold ${style.color}`}>{changeLabel}</p>
            </div>
            <div className={`mt-4 flex items-start gap-2 rounded-xl p-3 ${style.bg}`}>
              {forecast?.trend === 'Rising' && <AlertTriangle className={`mt-0.5 h-4 w-4 ${style.color}`} />}
              <p className={`text-sm font-semibold ${style.color}`}>
                {forecast?.warning || 'Take an assessment to unlock your burnout forecast'}
              </p>
            </div>
          </div>

          <div className="h-32 rounded-xl bg-gray-50 p-2 dark:bg-gray-900">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="label" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={style.stroke}
                  strokeWidth={3}
                  dot={{ fill: style.stroke, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
