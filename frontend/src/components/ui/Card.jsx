/**
 * Card component
 */
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft
        transition-all duration-200 hover:shadow-md-soft
        border border-gray-100 dark:border-gray-700
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Header
 */
export const CardHeader = ({ children, className = '' }) => {
  return <div className={`mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
}

/**
 * Card Title
 */
export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-xl font-bold text-gray-900 dark:text-white ${className}`}>{children}</h3>
}

/**
 * Card Description
 */
export const CardDescription = ({ children, className = '' }) => {
  return <p className={`text-gray-600 dark:text-gray-400 text-sm ${className}`}>{children}</p>
}

/**
 * Card Content
 */
export const CardContent = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>
}

/**
 * Card Footer
 */
export const CardFooter = ({ children, className = '' }) => {
  return <div className={`mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 ${className}`}>{children}</div>
}
