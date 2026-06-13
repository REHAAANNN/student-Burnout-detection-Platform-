import { AlertCircle } from 'lucide-react'

/**
 * Error message component
 */
export const ErrorMessage = ({ message, onDismiss, className = '' }) => {
  return (
    <div className={`bg-danger-50 dark:bg-danger-900/20 border-l-4 border-danger-500 p-4 rounded ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-danger-700 dark:text-danger-300">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-danger-500 hover:text-danger-700 ml-2 flex-shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Success message component
 */
export const SuccessMessage = ({ message, className = '' }) => {
  return (
    <div className={`bg-success-50 dark:bg-success-900/20 border-l-4 border-success-500 p-4 rounded ${className}`}>
      <p className="text-sm text-success-700 dark:text-success-300">✓ {message}</p>
    </div>
  )
}
