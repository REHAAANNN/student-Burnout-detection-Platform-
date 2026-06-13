import { forwardRef } from 'react'

/**
 * TextArea component
 */
export const TextArea = forwardRef(
  (
    {
      label,
      error,
      placeholder,
      className = '',
      disabled = false,
      maxLength,
      showCharCount = true,
      value,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          className={`
            w-full px-4 py-3 rounded-lg border-2 border-gray-200
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
            dark:bg-gray-800 dark:border-gray-700 dark:text-white
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            transition-all duration-200 resize-vertical min-h-32
            ${error ? 'border-danger-500' : ''}
            ${className}
          `}
          {...props}
        />
        <div className="mt-2 flex justify-between items-center">
          {error && <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>}
          {showCharCount && maxLength && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {value?.length || 0}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
