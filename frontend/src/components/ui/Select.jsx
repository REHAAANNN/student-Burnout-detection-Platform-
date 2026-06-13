import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Select component
 */
export const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = 'Select an option',
      className = '',
      disabled = false,
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
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-2 pr-10 rounded-lg border-2 border-gray-200
              focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              transition-all duration-200 appearance-none
              ${error ? 'border-danger-500' : ''}
              ${className}
            `}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

/**
 * MultiSelect component
 */
export const MultiSelect = ({ label, error, options = [], value = [], onChange, className = '' }) => {
  const handleChange = (optionValue) => {
    const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]
    onChange(newValue)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleChange(option.value)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-left
              ${
                value.includes(option.value)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:border-primary-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
              }
            `}
          >
            <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
    </div>
  )
}
