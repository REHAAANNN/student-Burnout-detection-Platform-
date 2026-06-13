import { forwardRef } from 'react'

/**
 * Input component
 */
export const Input = forwardRef(
  (
    {
      label,
      error,
      type = 'text',
      placeholder,
      className = '',
      disabled = false,
      icon: Icon,
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
          {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-2 rounded-lg border-2 border-gray-200
              focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              transition-all duration-200
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-danger-500 focus:border-danger-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
