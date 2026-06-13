/**
 * Loader component
 */
export const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 animate-spin`} />
    </div>
  )
}

/**
 * Full screen loader
 */
export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-50 backdrop-blur-sm">
      <Loader size="lg" />
    </div>
  )
}
